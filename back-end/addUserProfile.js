const express = require('express')
const router = express.Router()
const { Connection, User, Platform } = require('./models/User')
const mongoose = require('mongoose')


router.post('/saveConnection', async (req, res) => {
  try {
    const { userId, friend_id, platforms, connected_date } = req.body
    const user = await User.findById(userId)
    const friendIdStr = new mongoose.Types.ObjectId(friend_id).toString()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    console.log('friendIdStr', friendIdStr)

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
      };
      user.connections.push(connectionData)
      await user.save();
      return res.status(200).json({ message: 'Connection added successfully', user })

    }
  } catch (error) {
    console.log('Error:', error.message)
    res.status(400).json({ message: error.message })
  }
})

        
        

module.exports = router
