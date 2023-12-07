import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ScanCode.css";
//import QRCode from 'qrcode.react';


function ScanCode() {
	const [imageUrl, setImageUrl] = useState("")
	const navigate = useNavigate()
	
	useEffect(() => {
		async function fetchImage() {
			try {	
				const response = await axios.get(`${process.env.REACT_APP_API_URL}/images/home-logo-image`, {
					responseType: 'blob',
				});
				const url = window.URL.createObjectURL(new Blob([response.data]))
				if (response.status) {
					setImageUrl(url)
				}
			} catch (error) {
				console.error('Error fetching image:', error.message)
			}
		}

		fetchImage();

	}, [])

	function handleFileChange(event) {
		const file = event.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = async (e) => {
				const imageDataUrl = e.target.result
				try {
					const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/scan`, {
						qrData: imageDataUrl
					});
					
					navigate(`/ConnectionDetails/${response.data.qrCodeText}`, { state: { qrCodeText: response.data.qrCodeText, qrImageData: imageDataUrl } })
				
				} catch (error) {
					console.error('Error sending QR data to backend:', error);
				}
			};
			reader.readAsDataURL(file);
		}
	}




	return (

		<div className='Box'>
			<script type="module" src="/static/ScanCode.js"></script>
			<img className="Logo" src={imageUrl} alt=""></img>
			<input type="file" accept="image/*" capture="camera" id="file-input" onChange={handleFileChange} style={{ display: 'none' }} />
			<label htmlFor="file-input" className="scanButton">Scan</label>


		</div>
	);
}

export default ScanCode;
