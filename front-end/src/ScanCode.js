import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ScanCode.css";

function ScanCode() {
	const [imageUrl, setImageUrl] = useState("")
	const navigate = useNavigate()
	
	useEffect(() => {
		async function fetchImage() {
			try {
				const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/ScanCode`);
				if (response.status === 200 && response.data.LogoUrl) {
					console.log(response.data)
					setImageUrl(response.data.LogoUrl);
				}
			} catch (error) {
				console.error('Error fetching image:', error.message);
			}
		}

		fetchImage();

	}, []);

	axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/user/searchUser`, { userId: '6562c186a4a586c6e19a4eef' })
	.then(response => {
	console.log('Platform Data:', response.data);
	})
	.catch(error => {
	console.error('Error fetching data:', error);
	});

	function handleFileChange(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const imageDataUrl = e.target.result;
				try {
					const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/ScanCode`, {
						qrData: imageDataUrl
					});
					
					navigate(`/ConnectionDetails?=${response.data.qrCodeText}`, { state: { qrCodeText: response.data.qrCodeText, qrImageData: imageDataUrl } })
					//console.log('Response from backend:', response.data);
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
