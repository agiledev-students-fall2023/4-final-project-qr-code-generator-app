const { body, validationResult } = require('express-validator')
const express = require('express')
const router = express.Router()
require('dotenv').config()
const User = require('./models/User.js')

router.post('/', 
    body('decodedToken').notEmpty().withMessage('Decoded token is required'),
    body('decodedToken.userId').notEmpty().withMessage('User ID is required'),

    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { decodedToken } = req.body

        try {
            res.json({ decodedToken })
        } catch (error) {
            res.status(500).json({ error: 'Server error' })
        }
    }
)

module.exports = router
