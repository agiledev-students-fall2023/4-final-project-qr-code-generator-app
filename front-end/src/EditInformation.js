import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditInformation.css";

const platformOptions = [
	{ value: "", label: "Select platform" },
	{ value: "Phone number", label: "Phone number" },
	{ value: "Personal website", label: "Personal website" },
	{ value: "Linkedin", label: "Linkedin" },
	{ value: "Instagram", label: "Instagram" },
	{ value: "Facebook", label: "Facebook" },
	{ value: "Twitter", label: "Twitter" },
	{ value: "Github", label: "Github" },
	{ value: "Custom", label: "Custom" }
];

const EditInformation = () => {
	// Array of maps of containing platform, info
	const [platformInformationMap, setPlatformInformationMap] = useState([]);
	// State to hold profile data
	const [profileData, setProfileData] = useState({});
	// State for error message
	const [errorMessage, setErrorMessage] = useState("");
	const [buttonClicked, setButtonClicked] = useState(false); // State to handle button click
  const [userId, setUserId] = useState(""); // State to hold userId

  // In final implementation, we will retrieve userId of current logged in user
  // For now, we just mock userId
  useEffect(() => {
    // Here, we would change it to retrieve userId from /protected backend route
    const userId = '6562c186a4a586c6e19a4eef'
    // In final implementation
    // Only if valid userId, fetch data
    // Otherwise, send client to login page
    setUserId(userId);
    fetchData(userId);
    fetchProfileData(userId);
  }, []);

  const fetchData = async (userId) => {
    try {
      // We are taking REACT_APP_BACKEND_SERVER_HOSTNAME from .env file
      // Ensure .env file is setup for this to work
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_HOSTNAME}/users/${userId}/platforms`)        
      const data = response.data
      // Map the fetched data to maintain the structure
      const updatedPlatformInformationMap = data.map((entry) => {
        // Check if the entry name exists in the platformOptions list
        // If doesn't exist, set isCustom flag
        const isCustom = !platformOptions.some((option) => option.value === entry.name)

        if (isCustom) {
          return {
            name: entry.name,
            value: entry.value,
            isCustom: true,
          }
        } else {
          return {
            name: entry.name,
            value: entry.value,
          }
        }
      })
      setPlatformInformationMap(updatedPlatformInformationMap)
    } catch (error) {
      console.error('Error fetching platform data:', error)
    }
  }

  // Fetch profile data: email, firstname, lastname, profile pic
  const fetchProfileData = async (userId) => {
    try {
      // We are taking REACT_APP_BACKEND_SERVER_HOSTNAME from .env file
      // Ensure .env file is setup for this to work
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_HOSTNAME}/users/${userId}`)
      const data = response.data
      setProfileData(data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

	// Handle change in platform name
	const handlePlatformChange = (index, event) => {
		const { value } = event.target;
		const updatedPlatformInformationMap = [...platformInformationMap];
		
		// If Custom was chosen, set to blank text box and set isCustom flag
		if (value === "Custom") {
			updatedPlatformInformationMap[index] = {
				name: "",
				value: "",
				isCustom: true,
			};
		} else {
			updatedPlatformInformationMap[index].name = value;
			updatedPlatformInformationMap[index].isCustom = false;
		}
		setPlatformInformationMap(updatedPlatformInformationMap);
	};

	// Handle change in custom platform text box
	const handleCustomPlatformChange = (index, event) => {
		const updatedPlatformInformationMap = [...platformInformationMap];
		updatedPlatformInformationMap[index].name = event.target.value;
		updatedPlatformInformationMap[index].isCustom = true;
		setPlatformInformationMap(updatedPlatformInformationMap);
	};

	// Handle change in platform information
	const handleInfoChange = (index, event) => {
		const updatedPlatformInformationMap = [...platformInformationMap];
		updatedPlatformInformationMap[index].value = event.target.value;
		setPlatformInformationMap(updatedPlatformInformationMap);
	};

	// Handle adding new entry of platform name and information
	const handleAddPlatformInformation = () => {
		const updatedPlatformInformationMap = [...platformInformationMap, { name: "", value: "" }];
		setPlatformInformationMap(updatedPlatformInformationMap);
	};

	// Handle deleting an entry of platform name and information
	const handleDeletePlatform = (index) => {
		const updatedPlatformInformationMap = platformInformationMap.filter((_, i) => i !== index);
		setPlatformInformationMap(updatedPlatformInformationMap);
	};

  // Handles user uploading new profile picture
  // Sends image as multipart form data to backend uploadPicture route
  // Then saves a local browser url that temporarily holds the image to profileData
  const handleProfilePictureUpload = async (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('file', image)

    try {
      const response = await axios.put(
        // Ensure .env file is set up for this to work
        `${process.env.REACT_APP_BACKEND_SERVER_HOSTNAME}/users/${userId}/uploadPicture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

			if (response.status === 200) {
				// If successful PUT, retrieve it and set it immediately to display
        try {
          // We are taking REACT_APP_BACKEND_SERVER_HOSTNAME from .env file
          // Ensure .env file is setup for this to work
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_HOSTNAME}/users/${userId}/profilePicture`)        
          const data = response.data
          setProfileData({ ...profileData, profile_picture: data.profile_picture })
        } catch (error) {
          console.error('Error fetching profile picture:', error)
        }
			}
		} catch (error) {
			console.error("Error uploading profile picture:", error)
		}
	};

  // Handle saving all profile data and platform information (does not include profile picture)
  // Duplicate entries with non-empty info will not be allowed to save
  // Any entry with empty platform or info will not get saved
  const handleSave = async () => {
    // Saving of profile data
    try {
      // Update buttonClicked state to trigger the CSS effect
      setButtonClicked(true);
      setTimeout(() => {
        // Reset buttonClicked state after a delay
        setButtonClicked(false);
      }, 1000); // Set the duration of the darkening effect (in milliseconds)

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_SERVER_HOSTNAME}/users/${userId}`,
        profileData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.status !== 200) {
        throw new Error(`Network response was not ok. Status Code: ${response.status}`)
      }
      setProfileData(profileData) // Update profileData after successful save
    } catch (error) {
      console.error('Error saving data:', error)
    }
    // Saving of platform info
    try {
      // Check for duplicate entries
      const platformNames = new Set();
      for (const item of platformInformationMap) {
        if (item.name && item.value) {
          if (platformNames.has(item.name)) {
            // Set the error message immediately if a duplicate is found
            setErrorMessage('Error: Cannot save duplicate entries of the same platform.')
            return;
          } else {
            platformNames.add(item.name)
          }
        }
      }
      // Clear the error message if no duplicates are found
      setErrorMessage('');

      // Filter out the entries with either empty platform or empty info
      const filteredPlatformInformationMap = platformInformationMap
        .filter((item) => item.name !== '' && item.value !== '')
	
      // For the data to be sent to backend, only send platform and info fields, without isCustom
      const requestBody = {
        platforms: filteredPlatformInformationMap.map(({ name, value }) => ({ name, value }))
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_SERVER_HOSTNAME}/users/${userId}/platforms`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
	if (response.status !== 200) {
		throw new Error(`Network response was not ok. Status Code: ${response.status}`);
	}

	// Update the platformInformationMap state with all fields included
	setPlatformInformationMap(filteredPlatformInformationMap);
	} catch (error) {
		console.error("Error saving data:", error);
	}
  };

	return (
		<div className="edit-information-container">
			{/* Displays picture and upload picture button */}
			<div className="edit-information-header">
				<h2>Edit Personal Information</h2>
				{/* Display profile picture if not undefined */}
				{profileData.profile_picture && (
          <img
            src={`${process.env.REACT_APP_BACKEND_SERVER_HOSTNAME}/static/uploads/${profileData.profile_picture}`}
            alt="Profile"
            className="profile-picture"
          />
        )}
				<div className="upload-container">
					<label htmlFor="file-upload" className="custom-file-upload">
						Upload picture
					</label>
					<input
						id="file-upload"
						type="file"
						accept="image/*"
						onChange={handleProfilePictureUpload}
					/>
				</div>
			</div>
			<div className="profile-section">
				<p>Name: </p>
				<input
					type="text"
					placeholder="First name"
					value={profileData.first_name}
					onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
				/>
				<input
					type="text"
					placeholder="Last name"
					value={profileData.last_name}
					onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
				/>
				<p>Email: {profileData.email}</p>
			</div>
			{/* Display each row of platform name and information */}
			{platformInformationMap.map((item, index) => (
				<div key={index}>
					<div className="platform-container">
						{/* Conditionally render based on whether it's a custom platform */}
            {item.isCustom? (
              <>
                {/* Two text boxes for custom platform */}
                <input
                  type="text"
                  placeholder="Platform"
                  value={item.name}
                  onChange={(e) =>
                      handleCustomPlatformChange(index, e)
                  }
                />
                <input
                  type="text"
                  placeholder="Link / Information"
                  value={item.value}
                  onChange={(e) => handleInfoChange(index, e)}
                />
              </>
            ) : (
              <>
                {/* Dropdown + text box for non-custom platforms */}
                <select
                  value={item.name}
                  onChange={(e) => {
                    handlePlatformChange(index, e);
                  }}
                >
                  {platformOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                  {/* Text input for non-custom platforms */}
                  {item.name !== "" && (
                    <input
                      type="text"
                      placeholder="Link / Information"
                      value={item.value}
                      onChange={(e) =>
                        handleInfoChange(index, e)
                      }
                    />
                  )}
                </>
            )}
						{/* Delete entry */}
						<button onClick={() => handleDeletePlatform(index)}>X</button>
					</div>
				</div>
			))}
			{/* Add new entry */}
			<button onClick={handleAddPlatformInformation} className="add-platform-button">
				Add platform
			</button>

			{/* Save updated platform information */}
			<button
				type="button"
				className={`save-button ${buttonClicked ? "clicked" : ""}`}
				onClick={handleSave}
			>
				Save
			</button>
			{/* Display error message */}
			{errorMessage && (
				<div className="error-message">{errorMessage}</div>
			)}
		</div>
	);
};

export default EditInformation;
