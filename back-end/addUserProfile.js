const express = require('express')
const router = express.Router()
const { Connection, User, Platform } = require('./models/User')
const mongoose = require('mongoose')
const { param, body, validationResult } = require('express-validator')

router.post('/save/:id',   // Data Validation
  param('id').notEmpty().withMessage('User ID is required'),
  body('friend_id').notEmpty().withMessage('Friend ID is required'),
  body('platforms').isArray().withMessage('Platforms must be an array'),
  body('connected_date').notEmpty().withMessage('Connected date is required'),
  async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const userId = req.params.id
    const friend_id = req.body.friend_id
    const platforms = req.body.platforms
    const connected_date = req.body.connected_date

    const user = await User.findById(userId).exec()
    const friendIdStr = new mongoose.Types.ObjectId(friend_id).toString()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const existingConnectionIndex = user.connections.findIndex(
      connection => connection.friend_id.toString() == friend_id
    )

    if (existingConnectionIndex !== -1) {
      
      user.connections[existingConnectionIndex].platforms = platforms
      user.connections[existingConnectionIndex].connected_date = connected_date
      await user.save()
      return res.status(200).json({ message: 'Connection updated successfully', user })
    } else {
      
      const connectionData = {
        friend_id: new mongoose.Types.ObjectId(friend_id),
        platforms: platforms,
        connected_date: connected_date
      }
      user.connections.push(connectionData)
      await user.save()
      return res.status(200).json({ message: 'Connection added successfully', user })

    }
  } catch (error) {
    console.log('Error:', error.message)
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
