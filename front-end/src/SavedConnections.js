import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './SavedConnections.css';

const SavedConnections = () => {
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();
  const defaultImage = '/default.png'; 

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const response = await axios.get(`http://localhost:3001/connections/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);

        // Filter out duplicate connections based on friend_id
        const uniqueConnections = Array.from(new Set(response.data.map(conn => conn.friend_id)))
          .map(id => {
            return response.data.find(conn => conn.friend_id === id)
          });

        setConnections(uniqueConnections);
      } catch (error) {
        console.error('Error fetching connections data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleConnectionClick = (friendId) => {
    if (friendId) {
      navigate(`/ConnectionDetails?qrCodeText=${friendId}`);
    } else {
      console.error('Undefined connection ID');
    }
  };

  return (
    <div className="saved-connections-container">
        <h2>Saved Connections</h2>
        <div className="connections-grid">
            {connections.map((connection, index) => (
                <div key={index}
                     className="connection-box"
                     onClick={() => handleConnectionClick(connection.friend_id)}>
                    <img src={connection.profile_picture || defaultImage} alt={`${connection.first_name} ${connection.last_name}`} />
                    <p className="connection-box-text">{`${connection.first_name} ${connection.last_name}`}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default SavedConnections;
