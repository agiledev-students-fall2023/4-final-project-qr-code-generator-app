const express = require('express')
const cors = require('cors')
const jsQR = require('jsqr')
const axios = require('axios')
const { User } = require('./models/User')
require('dotenv').config()
const { createCanvas, loadImage } = require('canvas')
const { isValidObjectId } = require('mongoose')
const { body, validationResult } = require('express-validator')
const router = express.Router()
router.use(cors())
router.use(express.urlencoded({ extended: true }))
router.use(express.json())

router.get('/ScanCode', (req, res) => {
  try {
    const LogoUrl = 'https://picsum.photos/200/300'
    res.json({ LogoUrl })
  } catch (error) {
    console.error('Error in ScanCode:', error)
    res.status(500).send('Internal Server Error')
  }
})

router.post('/ScanCode',
body('qrData').notEmpty().withMessage('QR data is required'),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Error")
    return res.status(400).json({ errors: errors.array() })
  }

  const { qrData } = req.body

  const base64Data = qrData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')

  try {
    console.log('Loading image from QR data...')
    const image = await loadImage(`data:image/png;base64,${base64Data}`)
    const canvas = createCanvas(image.width, image.height)
    const context = canvas.getContext('2d')

    context.drawImage(image, 0, 0)
    const imageData = context.getImageData(0, 0, image.width, image.height)

    console.log('Decoding QR code...')
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      console.log(`QR Code found: ${code.data}`)
      res.json({ qrCodeText: code.data, qrImageBase64: base64Data })
    } else {
      console.log('No QR code found in the provided image.')
      res.status(400).send('No QR code found.')
    }
  } catch (error) {
    console.error('Error processing QR code:', error)
    res.status(500).send('Error processing QR code')
  }
})

router.post('/ConnectionDetails', async (req, res) => {
  const { qrCodeText } = req.body
  console.log(`QR Code Text: ${qrCodeText}`)

  if (!isValidObjectId(qrCodeText)) {
    return res.status(400).send('Invalid User ID')
  }

  try {
   
    const user = await User.findOne({ _id: qrCodeText }).select('first_name last_name profile_picture platforms');
    console.log('User found:', user)

    if (!user) {
      return res.status(404).send('User not found')
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/saveConnection', async (req, res) => {
  const { userId, friend_id, platforms, connected_date, first_name, last_name, profile_picture } = req.body;

  try {
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          connections: {
            friend_id,
            platforms,
            connected_date,
            first_name,  // Added
            last_name,   // Added
            profile_picture // Added
          }
        }
      }
    );

    res.status(200).json({ message: 'Connection saved successfully' });
  } catch (error) {
    console.error('Error saving connection:', error);
    res.status(500).send('Error saving connection');
  }
});

router.post('/getUserDetails', async (req, res) => {
  const { id } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).send('Invalid ID');
  }

  try {
    const user = await User.findById(id).select('first_name last_name profile_picture');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router