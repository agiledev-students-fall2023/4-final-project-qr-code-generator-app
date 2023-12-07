// Import React hooks, axios for HTTP requests, and the component's CSS
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './HomeScreen.css'

// Define the HomeScreen component
const HomeScreen = () => {
  // Create a piece of state to hold the source URL of the image
  const [imageSrc, setImageSrc] = useState('')

  // Use the useEffect hook to fetch the image when the component mounts
  useEffect(() => {
    // Define an async function to fetch the image
    const fetchImage = async () => {
      try {
        // Use axios to send a GET request to the backend server to retrieve the image
        // The URL is constructed using the REACT_APP_API_URL environment variable, ensuring flexibility for different environments
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/images/home-logo-image`, {
          responseType: 'blob', // Set the response type to 'blob' since we're expecting binary data
        })
        // Create a local URL for the blob and update the imageSrc state
        const url = window.URL.createObjectURL(new Blob([response.data]))
        setImageSrc(url) // Update the imageSrc state with the image URL
      } catch (error) {
        // Log any errors to the console
        console.error('Error fetching image:', error)
      }
    }

    fetchImage() // Call the function to fetch the image
  }, []) // An empty dependency array means this effect runs once on component mount

  // Render the component's HTML
  return (
    <div className="home-container">
      <div className="home-header">
        <img src={imageSrc} alt="App Logo" className="app-logo" /> {/* Display the fetched image */}
        <p> Introducing QRConnect: Your go-to solution for effortlessly managing and sharing your social profiles.</p>
      </div>
      <div className="home-links">
        {/* Define navigation links for the app */}
        <a href="/scan-code" className="home-link">Scan QR Code</a>
        <a href="/edit-information" className="home-link">My Information</a>
        <a href="/saved-connections" className="home-link">My Connections</a>
        <a href="/select-information" className="home-link">Generate My QR Code</a>
      </div>
    </div>
  )
}

// Export the HomeScreen component for use in other parts of the app
export default HomeScreen
