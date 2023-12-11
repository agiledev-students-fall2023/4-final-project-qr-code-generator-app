import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import axios from "axios"
import QRCode from "react-qr-code"
import "./GenerateQRCode.css"
import { jwtDecode } from 'jwt-decode'


const GenerateQRCode = () => {
    const [userId, setUserId] = useState("")
    const location = useLocation()
    const getQueryParams = () => {
	const queryParams = new URLSearchParams(location.search)
	return queryParams.get('names')
      }
    useEffect(() => {
	const token = localStorage.getItem('token')
	if (!token) {
	console.error('No token found');
	return;
	}
      
	const fetchUserId = async () => {
	try {
	const decodedToken = jwtDecode(token)
	const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/generateQRCode`, { decodedToken }, {
		headers: {
		Authorization: `Bearer ${token}`
		}
	});
      
	setUserId(response.data.decodedToken.userId)
	
	} catch (error) {
	console.error("Error fetching user ID:", error)
	}
	};
      
	fetchUserId()
      }, []);

      const names = getQueryParams()
      console.log(`${userId}?names=${names}`)
    return (
        <div className="generateQRCodeContainer">
            <div className="generateQRCodeText">Your QR Code</div>
            <div className="qrCode">
                <QRCode
                    value={userId ? `${userId}?names=${names}` : 'www.google.com'}
                    size={128}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="L"
                />
            </div>
        </div>
    )
}
export default GenerateQRCode
