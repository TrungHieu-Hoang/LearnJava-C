const express = require('express');
const Exercise = require('../models/Exercise');
const { auth, optionalAuth } = require('../middleware/auth');

const Submission = require('../models/Submission');

const router = express.Router();

// GET /api/exercises?lang=java&difficulty=easy&source=LeetCode
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { lang, difficulty, source, search, topicId } = req.query;
    const filter = {};

    if (lang) filter.language = lang;
    if (topicId) filter.topicId = topicId;
    if (difficulty) filter.difficulty = difficulty;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const exercises = await Exercise.find(filter)
      .select('-testCases')
      .sort({ difficulty: 1, title: 1 });

    let solvedExerciseIds = new Set();
    if (req.userId) {
      const solved = await Submission.find({ 
        userId: req.userId, 
        status: 'accepted' 
      }).select('exerciseId');
      solved.forEach(s => solvedExerciseIds.add(s.exerciseId.toString()));
    }

    // Calculate AC rate and attach isSolved
    const exercisesWithRate = exercises.map(ex => {
      const obj = ex.toObject();
      obj.acRate = ex.totalSubmissions > 0 
        ? Math.round((ex.acceptedSubmissions / ex.totalSubmissions) * 100) 
        : 0;
      obj.isSolved = solvedExerciseIds.has(obj._id.toString());
      return obj;
    });

    res.json({ exercises: exercisesWithRate });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/exercises/:id
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });
    }

    const obj = exercise.toObject();
    // Only show first test case's expected output, hide rest
    if (obj.testCases && obj.testCases.length > 0) {
      obj.testCases = obj.testCases.map((tc, idx) => ({
        input: tc.input,
        expectedOutput: idx === 0 ? tc.expectedOutput : '???'
      }));
    }
    obj.acRate = exercise.totalSubmissions > 0 
      ? Math.round((exercise.acceptedSubmissions / exercise.totalSubmissions) * 100) 
      : 0;

    res.json({ exercise: obj });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
