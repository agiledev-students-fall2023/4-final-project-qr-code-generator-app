const express = require('express')
const cors = require('cors')
const jsQR = require('jsqr')
const axios = require('axios')
const { User } = require('./models/User')
require('dotenv').config()
const { createCanvas, loadImage } = require('canvas')
const { isValidObjectId } = require('mongoose')

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

router.post('/ScanCode', async (req, res) => {
  const { qrData } = req.body;

  if (!qrData) {
    console.log('No QR data received in request.')
    return res.status(400).send('No QR data provided.')
  }

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
});

router.post('/ConnectionDetails', async (req, res) => {
  const { qrCodeText } = req.body;
  console.log(`QR Code Text: ${qrCodeText}`)

  if (!isValidObjectId(qrCodeText)) {
    return res.status(400).send('Invalid User ID')
  }

  try {
   
    const user = await User.findOne({ _id: qrCodeText })
    console.log('User found:', user)

    if (!user) {
      return res.status(404).send('User not found')
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
});


module.exports = router