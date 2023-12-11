const express = require('express');
const path = require('path');
const router = express.Router();

// Define the path to the Static directory relative to unchanged-image.js
const staticDirPath = path.join(__dirname, 'Static');

// Route to serve the Logo.png file
router.get('/home-logo-image', (req, res) => {
  // Define the path to your logo
  const logoPath = path.join(staticDirPath, 'Logo.png');

  // Send the logo file in the response
  res.sendFile(logoPath);
});

module.exports = router;
