const express = require('express');
const Topic = require('../models/Topic');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/topics?lang=java
router.get('/', async (req, res) => {
  try {
    const { lang } = req.query;
    const filter = {};
    
    if (lang) {
      filter.language = lang;
    }
    filter.status = 'active';

    const topics = await Topic.find(filter)
      .sort({ language: 1, order: 1 })
      .select('-theoryHTML');

    res.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/topics/:id
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Không tìm thấy chủ đề' });
    }

    res.json({ topic });
  } catch (error) {
    console.error('Get topic error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
