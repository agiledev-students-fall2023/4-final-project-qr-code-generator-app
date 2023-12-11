const express = require('express')
const { param, body, validationResult, matchedData } = require('express-validator')
const axios = require('axios')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const path = require('path')
const multer = require('multer') // middleware to handle HTTP POST requests with file uploads
const passport = require('passport')

const router = express.Router()

const { User } = require('./models/User.js')

// covers both user and platform routes
router.get('/*', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    next()
  }
)
router.put('/*', passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    next()
  }
)

// Multer handles file uploads
// enable file uploads saved to disk in a directory named 'public/uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    // take apart the uploaded file's name so we can create a new one based on it
    const extension = path.extname(file.originalname)
    const basename = path.basename(
      file.originalname,
      extension
    )
    // create a new filename with a timestamp in the middle
    const filename = `${basename}-${Date.now()}${extension}`
    // tell multer to use this new filename for the uploaded file
    cb(null, filename)
  }
})
const upload = multer({ storage })

// /users/:id (gets user info (no pass))
router.get('/:id', 
  param('id').notEmpty().isMongoId(),
  async (req, res) => {
  const result = validationResult(req)
  if (!(result.isEmpty())) {
    res.status(400).json({ error: 'Invalid request' })
  } else {
    try {
      const user = await User.findById(req.params.id).exec()
      // Extracts and returns only user profile data
      const user_profile = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture: user.profile_picture
      }
      res.json(user_profile)
    } catch (err) {
      console.error(`Error fetching user profile data: ${err}`)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
})

// /users/:id (update/create user information)
router.put('/:id', 
  param('id').notEmpty().isMongoId(), 
  body('email').optional().notEmpty().isEmail(),
  body('first_name').optional().notEmpty().escape(),
  body('last_name').optional().notEmpty().escape(),
  async (req, res) => {
  try {
    const result = validationResult(req)
    if (!(result.isEmpty())) {
      res.status(400).json({ error: 'Invalid request' })
    } else {
      const data = matchedData(req)
      // Update user information
      // since this is just an update and not a create we don't need to guarantee
      // every field.
      const user = await User.findById(data.id).exec()
      if (data.email) {
        user.email = data.email
      }
      if (data.first_name) {
        user.first_name = data.first_name
      }
      if (data.last_name) {
        user.last_name = data.last_name
      }
      await user.save()

      res.status(200).json({ message: 'User information updated successfully.' })
    }
  } catch (err) {
    console.error(`Error updating user information: ${err}`)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// /users/:id/profilePicture (gets profile picture path)
router.get('/:id/profilePicture', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec()
    // Extracts and returns only user profile data
    const user_profile = {
      profile_picture: user.profile_picture
    }
    res.json(user_profile)
  } catch (err) {
    console.error(`Error fetching user profile picture: ${err}`)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// /users/:id/profilePicture (uploads profile picture to web server)
router.put('/:id/uploadPicture', upload.single('file'), async (req, res) => {
  // Assuming the file is successfully uploaded
  if (req.file) {
    try {
      const user = await User.findById(req.params.id).exec()
      // Save the file path or name in the url_picture variable
      user.profile_picture = req.file.filename
      // Then save this to the user's data in database
      await user.save()
      res.status(200).json({ message: 'Profile picture updated successfully.' })
    } catch(err) {
      console.error(`Error uploading user profile picture: ${err}`)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.status(400).json({ error: 'No file uploaded' })
  }
})

module.exports = router
