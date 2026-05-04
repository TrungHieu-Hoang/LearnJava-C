const express = require('express');
const Exercise = require('../models/Exercise');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { executeCode, runTestCases } = require('../services/codeRunner');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter for run endpoint
const runLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau' }
});

// POST /api/submissions/run — Run code without saving
router.post('/run', auth, runLimiter, async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Vui lòng cung cấp code và ngôn ngữ' });
    }

    if (!['java', 'cpp', 'c', 'python'].includes(language)) {
      return res.status(400).json({ message: 'Ngôn ngữ không hỗ trợ' });
    }

    const result = await executeCode(language, code, input || '');
    
    res.json({
      output: result.stdout,
      error: result.stderr,
      status: result.status,
      timedOut: result.timedOut
    });
  } catch (error) {
    console.error('Run error:', error);
    res.status(500).json({ message: 'Lỗi khi chạy code' });
  }
});

// POST /api/submissions/submit — Submit and grade
router.post('/submit', auth, async (req, res) => {
  try {
    const { code, language, exerciseId } = req.body;

    if (!code || !language || !exerciseId) {
      return res.status(400).json({ message: 'Thiếu thông tin nộp bài' });
    }

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });
    }

    // Run against all test cases
    const testResults = await runTestCases(language, code, exercise.testCases);
    
    const passedTests = testResults.filter(r => r.passed).length;
    const totalTests = testResults.length;
    const allPassed = passedTests === totalTests;

    // Determine status
    let status = 'wrong';
    if (allPassed) {
      status = 'accepted';
    } else if (testResults.some(r => r.status === 'tle')) {
      status = 'tle';
    } else if (testResults.some(r => r.status === 'error')) {
      status = 'error';
    }

    // Save submission
    const submission = new Submission({
      userId: req.userId,
      exerciseId,
      code,
      language,
      status,
      output: testResults.map(r => r.actualOutput).join('\n---\n'),
      testResults,
      passedTests,
      totalTests
    });
    await submission.save();

    // Update exercise stats
    exercise.totalSubmissions += 1;
    if (allPassed) {
      exercise.acceptedSubmissions += 1;
    }
    await exercise.save();

    // If accepted, update user points (only first accepted submission for this exercise)
    if (allPassed) {
      const previousAccepted = await Submission.findOne({
        userId: req.userId,
        exerciseId,
        status: 'accepted',
        _id: { $ne: submission._id }
      });

      if (!previousAccepted) {
        await User.findByIdAndUpdate(req.userId, {
          $inc: { points: exercise.points, solvedExercises: 1 }
        });
      }
    }

    res.json({
      submission: {
        _id: submission._id,
        status,
        testResults: testResults.map(r => ({
          input: r.input,
          expectedOutput: r.expectedOutput,
          actualOutput: r.actualOutput,
          passed: r.passed,
          error: r.error
        })),
        passedTests,
        totalTests,
        points: allPassed ? exercise.points : 0
      }
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ message: 'Lỗi khi nộp bài' });
  }
});

// GET /api/submissions/me — User's submission history
router.get('/me', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.userId })
      .populate('exerciseId', 'title language difficulty source points')
      .sort({ executedAt: -1 })
      .limit(100);

    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/submissions/:exerciseId — Submissions for a specific exercise
router.get('/:exerciseId', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      userId: req.userId,
      exerciseId: req.params.exerciseId 
    })
    .sort({ executedAt: -1 })
    .limit(20);

    res.json({ submissions });
  } catch (error) {
    console.error('Get exercise submissions error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
