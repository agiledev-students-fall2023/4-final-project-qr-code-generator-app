
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ConnectionDetails.css";
import {jwtDecode} from 'jwt-decode';

const ConnectionDetails = () => {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState([]);
	const [friendDetails, setFriendDetails] = useState({ first_name: '', last_name: '', profile_picture: '' }); 
    const [isQRCodeVisible, setQRCodeVisible] = useState(false);
    const location = useLocation();
    const queryParameter = new URLSearchParams(location.search);
    const qrCodeText = queryParameter.get('qrCodeText');
    const { qrImageData } = location.state || {};


	useEffect(() => {
		async function fetchScanResult() {
			try {
				await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/ConnectionDetails/`, { qrCodeText })
					.then(response => {
						if (response.status === 200) {
							setScanResult(response.data);
							console.log(response.data);
							setFriendDetails({
								first_name: response.data.first_name, 
								last_name: response.data.last_name, 
								profile_picture: response.data.profile_picture
							});
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

	const handleSaveCode = async () => {
		const token = localStorage.getItem('token')
		if (!token) {
			console.error('No token found')
			return
		}
	
		const decodedToken = jwtDecode(token)
		const userId = decodedToken.userId
	
		// Fetch friend's details
		let friendDetails
		try {
			const friendResponse = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/getUserDetails`, { id: qrCodeText })
			if (friendResponse.status === 200) {
				friendDetails = friendResponse.data
			} else {
				console.error('Error fetching friend details')
				return
			}
		} catch (error) {
			console.error('Error fetching friend details:', error)
			return
		}
	
		// Prepare new user connection data with friend's details
		const newUserConnection = {
			userId,
			friend_id: qrCodeText,
			first_name: friendDetails.first_name, 
			last_name: friendDetails.last_name,
			profile_picture: friendDetails.profile_picture,
			platforms: scanResult.platforms,
			connected_date: new Date()
		}
	
		console.log("New User Connection:", newUserConnection)
	
		try {
			const response = await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/saveConnection`, newUserConnection)
			console.log(response.data.message) 
			navigate("/saved-connections")
			console.log("Navigate to Save Code")
		} catch (error) {
			console.error('Error in saving user profile:', error)
		}
	}
	
    

	return (

		<div className='Box'>
			<div className="userName">
                <img src={friendDetails.profile_picture} alt={`${friendDetails.first_name} ${friendDetails.last_name}`} />
                <h2>{friendDetails.first_name} {friendDetails.last_name}</h2>
            </div>

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

