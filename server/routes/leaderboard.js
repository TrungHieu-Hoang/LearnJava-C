const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .select('username points solvedExercises avatar createdAt')
      .sort({ points: -1 })
      .limit(50);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      _id: user._id,
      username: user.username,
      points: user.points,
      solvedExercises: user.solvedExercises,
      avatar: user.avatar,
      createdAt: user.createdAt
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
