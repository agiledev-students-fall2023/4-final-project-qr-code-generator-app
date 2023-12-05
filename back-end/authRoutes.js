const express = require('express')
const { body, validationResult, matchedData } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { User } = require('./models/User.js') // Ensure this path is correct

// Middleware to parse JSON
router.use(express.json())

// Function to generate JWT
const generateToken = user => {
  const jwtSecret = process.env.JWT_SECRET
  return jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' })
}

// /signup (creates a new user)
router.post('/signup', 
  // unique email check below
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
  body('first_name').notEmpty().escape(),
  body('last_name').notEmpty().escape(),
  async (req, res) => {
  try {
    const result = validationResult(req)
    if (!(result.isEmpty())) {
      res.status(400).json({ error: 'Invalid request: all fields are required' })
    } else {
      const { email, password, first_name, last_name } = matchedData(req)

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = new User({ email, password: hashedPassword, first_name, last_name })
      await user.save()

      const token = generateToken(user)
      res.status(201).json({ token })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message })
  }
})

// /login (logs a user in)
router.post('/login', 
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
  try {
    const result = validationResult(req)
    if (!(result.isEmpty())) {
      res.status(400).json({ error: 'Invalid request: all fields are required' })
    } else {
      const { email, password } = matchedData(req)

      const user = await User.findOne({ email: email })
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const token = generateToken(user)
      res.status(200).json({ token })
    }
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message })
  }
})

// /logout (logs a user out, handled on front end by removing token)
router.post('/logout', (req, res) => {
  console.log('User logged out')
  res.status(200).json({ message: 'Logout successful' })
})

module.exports = router
