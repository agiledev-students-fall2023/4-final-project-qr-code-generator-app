
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ConnectionDetails.css";
import {jwtDecode} from 'jwt-decode';

const ConnectionDetails = () => {
	const navigate = useNavigate()
	console.log(navigate)
	const [scanResult, setScanResult] = useState([]);
	const [isQRCodeVisible, setQRCodeVisible] = useState(false);
	const location = useLocation();
	const queryParameter = new URLSearchParams(location.search);
	const { qrImageData } = location.state;
	const qrCodeText = queryParameter.get('');


	useEffect(() => {
		async function fetchScanResult() {
			try {
				await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/ConnectionDetails/`, { qrCodeText })
					.then(response => {
						if (response.status === 200) {
							setScanResult(response.data);
							console.log(response.data);

						}
					});
			} catch (error) {
				console.error(error);
			}
		}


		fetchScanResult();

	}, [qrCodeText])

	const handleViewCode = () => {
		setQRCodeVisible(true)
	}

	const handleHideCode = () => {
		setQRCodeVisible(false)
	}

	const handleSaveCode = () => {	
		const token = localStorage.getItem('token')
		if (!token) {
		console.error('No token found')

		return
		}

		const decodedToken = jwtDecode(token)
		const userId = decodedToken.userId
      
		const newUserConnection = {
		userId,
		friend_id: qrCodeText,
		platforms: scanResult.platforms,
		connected_date: new Date()
		}
     
		console.log("New User Connection:", newUserConnection)
     
		axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/saveConnection`, newUserConnection)
		.then(response => {
		console.log(response.data.message)	
		navigate("/saved-connections")
		console.log("Navigate to Save Code")
		})
	.catch(error => {
		console.error('Error in saving user profile:', error)
		});
		
      }

    

	return (

		<div className='Box'>
			
        {scanResult && (
            <>
               

                {scanResult.platforms && scanResult.platforms.map((platform, index) => (
                    <div className="detailsContainer" key={index}>
                        <div className="areaB">
                            {platform.name}
                        </div>
                        <div className="areaD">
                            <ul>
                                <li>{platform.value}</li>
                            </ul>
                        </div>
                    </div>
                ))}
            </>
        )}
			
				
					<div className="viewCode">
						<div onClick={handleViewCode}> View Code </div>
					</div>

				
				{isQRCodeVisible && <img className="newQRCode" src={qrImageData} alt="Scanned QR" />}


				<div className="hideCode">
					<div onClick={handleHideCode}> Hide Code </div>
				</div>

				<div className="saveCode">
					<div onClick={handleSaveCode}> Save Code </div>
				</div>

				
			</div>
		

	);
};

export default ConnectionDetails;

