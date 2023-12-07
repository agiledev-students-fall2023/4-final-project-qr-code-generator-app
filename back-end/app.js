const express = require('express')
const app = express()
require('dotenv').config({ silent: true })
const morgan = require('morgan')
const cors = require('cors')

// Import routes
const authRoutes = require('./authRoutes')
const connectionsRoutes = require('./connections')
const unchangedImagesRouter = require('./unchanged-images') // Ensure this path is correct
const connectionsdetailsRoutes = require('./ConnectionDetails')
const addNewConnectionRoutes = require('./addUserProfile') 
const userRoutes = require('./users')
const platformRoutes = require('./platforms')
const generateQRCodeRoutes = require('./generateQRCode');

// Morgan for logging requests
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static content
app.use('/static', express.static('public'))

//connect to MongoDB with Mongoose
const mongoose = require('mongoose')
const User = require('./models/User.js')

try {
  const connection_string = 
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`
  mongoose.connect(connection_string)
  console.log('Connected to MongoDB')
} catch (err) {
  console.error(`Error connecting to MongoDB: ${err}`)
}



/**
 * Typically, all middlewares would be included before routes
 * In this file, however, most middlewares are after most routes
 * This is to match the order of the accompanying slides
 */
// Routes
app.use('/images', unchangedImagesRouter)
app.use('/', authRoutes)
app.use('/users', userRoutes)
app.use('/users', platformRoutes)
app.use('/connections', connectionsRoutes)
app.use('/connections', addNewConnectionRoutes)
app.use('/scan', connectionsdetailsRoutes)
app.use('/generateQRCode', generateQRCodeRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('Hello from root')
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

module.exports = app
