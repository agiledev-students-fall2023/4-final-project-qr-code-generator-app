const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./models/User')
const authenticateToken = require('./authRoutes');
const router = express.Router();

router.get('/connections/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const user = await User.findById(userId);
    
    if (!user || !user.connections) {
      return res.status(404).json({ error: 'User not found or no connections available' });
    }

    const friendIds = user.connections.map(connection => connection.friend_id);

    res.json(friendIds);
  } catch (error) {
    console.error('Error fetching user connections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = router;
