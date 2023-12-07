require('dotenv').config() // Load environment variables from .env file
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
const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || 'yourDefaultJwtSecret'
  return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '24h' })
}

// Signup route
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

// Login route
// Login route
router.post('/login', 
  body('email').notEmpty().isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
  try {
    const result = validationResult(req);
    if (!(result.isEmpty())) {
      return res.status(400).json({ error: 'Invalid request: all fields are required' });
    }

    const { email, password } = matchedData(req);

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    // Send the token and the user's ID in the response
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  console.log('User logged out')
  res.status(200).json({ message: 'Logout successful' })
})

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  jwt.verify(token, process.env.JWT_SECRET || 'yourDefaultJwtSecret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    } else {
      req.user = decoded; // decoded payload of the token
      next();
    }
  });
};

// Protected route
router.get('/protected', authenticateToken, async (req, res) => {
  try {
    // Retrieve user details from the database using the userId from req.user
    const user = await User.findById(req.user.userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user details
    res.status(200).json({
      userId: user._id, // Send the userId to the front-end
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});


module.exports = router
