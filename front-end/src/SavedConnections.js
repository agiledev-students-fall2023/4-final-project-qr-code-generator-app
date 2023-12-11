import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './SavedConnections.css'

const SavedConnections = () => {
  const token = localStorage.getItem('token')
  const [userId, setUserId] = useState(() => '')
  const [connections, setConnections] = useState([])
  const navigate = useNavigate()
  const defaultImage = '/default.png' 
  const navigateHome = () => {
    navigate('/home')
  }

  useEffect(() => {
    if (!token) navigate('/login')
    else {
      // get user id
      axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/protected`,
                  { headers: { Authorization: `JWT ${token}` } })
      .then(res => setUserId(res.data.userId))
      .catch(err => console.error(err))
    }
  }, [token, navigate])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/connections/${userId}`, {
          headers: { Authorization: `JWT ${token}` }
        })
        
        const enhancedConnections = await Promise.all(response.data.map(async (conn) => {
          const userDetails = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/users/${conn.friend_id}`, {
            headers: { Authorization: `JWT ${token}` }
          })
          return {
            ...conn,
            first_name: userDetails.data.first_name,
            last_name: userDetails.data.last_name,
            profile_picture: userDetails.data.profile_picture || defaultImage
          }
        }))

        setConnections(enhancedConnections)
      } catch (error) {
        console.error('Error fetching connections data:', error)
      }
    }

    if (userId) fetchData()
  }, [navigate, token, userId])

  const handleConnectionClick = (friendId) => {
    if (friendId) {
      navigate(`/ConnectionDetails/${friendId}` , { state: { hideControls: true } })
    } else {
      console.error('Undefined connection ID')
    }
  }  

    // Function to handle delete
    const handleDeleteConnection = async (friendId) => {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_HOSTNAME}/connections/${userId}/${friendId}`, {
          headers: { Authorization: `JWT ${token}` }
        });
        setConnections(connections.filter(conn => conn.friend_id !== friendId));
      } catch (error) {
        console.error('Error deleting connection:', error);
      }
    };

  return (
    <div className="saved-connections-container">
      <div className="header-container">
        <h2>Saved Connections</h2>
        <button onClick={navigateHome} className="home-button">Home</button>
      </div>
      <div className="connections-grid">
        {connections.map((connection, index) => (
          <div key={index} className="connection-box">
            <img src={connection.profile_picture} alt={`${connection.first_name} ${connection.last_name}`} />
            <p className="connection-box-text">{`${connection.first_name} ${connection.last_name}`}</p>
            <div className="connection-actions">
              <button onClick={() => handleConnectionClick(connection.friend_id)}>View</button>
              <button onClick={() => handleDeleteConnection(connection.friend_id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedConnections
