const express = require('express')
const { param, body, validationResult, matchedData } = require('express-validator')
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router()

const { User, Platform } = require('./models/User.js')

// Route for retrieving platform information
// In final implementation, this will extract info tied to userId
router.get('/:id/platforms', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    // Extracts and returns only user platform data
    res.status(200).json(user.platforms)
  } catch(err) {
    console.error('Error fetching user platform data:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Route for updating platform information
router.put('/:id/platforms', 
  param('id').notEmpty().isMongoId(),
  // check that field names are valid for each platform
  body('platforms').custom(( value, { req }) => {
    return value.every(plat => plat.hasOwnProperty('name') && plat.hasOwnProperty('value'))
  }),
  // ** checks nested fields
  body('**.name').trim().notEmpty(),
  body('**.value').trim().notEmpty(),
  async (req, res) => {
  try {
    const result = validationResult(req)
    if (!(result.isEmpty())) {
      res.status(400).json({ error: 'Invalid request' })
    } else {
      const data = matchedData(req)
      const user = await User.findById(data.id)
      // Update the database with the received platform information
      // Need to convert plain objects to Platforms before adding
      const converted = []
      data.platforms.forEach(platform => {
        converted.push(new Platform({
          name: platform.name,
          value: platform.value
        }))
      })
      user.platforms = converted
      await user.save()

      res.status(200).json({ message: 'Platform information updated successfully' })
    }
  } catch (error) {
    console.error('Error updating platform information:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
