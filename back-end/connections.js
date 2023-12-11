const express = require('express')
const mongoose = require('mongoose')
const { User } = require('./models/User')
const { param, validationResult } = require('express-validator')
const passport = require('passport')
const router = express.Router()
const defaultImage = '/default.png' 

router.get('/*', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    next()
  }
)
router.delete('/*', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    next()
  }
)

const validateObjectId = (paramName) => [
  param(paramName).isMongoId(),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// /connections/:id (gets connections list of id)
router.get('/:id', validateObjectId('id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec()
    if (!user || !user.connections || res.stats === 400) {
      return res.status(404).json({ error: 'User not found or no connections available' })
    }
    res.json(user.connections)
  } catch (error) {
    console.error('Error fetching user connections:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.delete('/:userId/:friendId', 
  validateObjectId('userId'), 
  validateObjectId('friendId'), 
  async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { connections: { friend_id: req.params.friendId } } },
      { new: true }
    )

    if (!user || res.status === 400) {
      return res.status(404).send('User not found')
    }

    res.status(200).send('Connection deleted successfully')
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Internal Server Error')
  }
})

router.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

module.exports = router
