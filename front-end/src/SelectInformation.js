import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './SelectInformation.css'

const SelectInformation = props => {
  // grab authentication token to ensure logged in user
  const token = localStorage.getItem('token')
  const [userId, setUserId] = useState(() => '')
  const navigate = useNavigate()
  // platform data from db
  const [data, setData] = useState(() => [])
  // track which boxes are checked
  const [checked, setChecked] = useState(() => []) // bool array
  const [allChecked, setAllChecked] = useState(() => true) // bool

  const handleSelectAll = () => {
    const checkedCopy = checked
    // if all checked, then uncheck, else check
    setChecked(checkedCopy.map(() => !allChecked))
  }

  const handleCheckBox = e => {
    const checkedCopy = [...checked]
    checkedCopy[e.target.id] = e.target.checked
    setChecked(checkedCopy)
  }

  const handleSubmit = () => {
// Filter data based on the checked state
    const selectedPlatforms = data.filter((_, index) => checked[index])

    const selectedNames = selectedPlatforms.map(platform => platform.name)

    // Join the names with a comma (or another separator)
    const queryString = `names=${selectedNames.join(',')}`
    navigate(`/GenerateQRCode?${queryString}`);

    console.log('Submitted with selected names:', selectedNames)
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

  // get data from api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL
        const response = await axios.get(`${apiUrl}/users/${userId}/platforms`,
                          { headers: { Authorization: `JWT ${token}` } })
        setData(response.data)
      } catch (err) {
        console.error(err)
      }
    }
    if (userId) fetchData()
  }, [userId, token])

  // initialize checked after data is set
  useEffect(() => {
    setChecked(Array.from({ length: data.length }, () => true))
  }, [data])

  // check if all checked after `checked` changes (confusing i know)
  useEffect(() => {
    if (checked.length) {
      setAllChecked(checked.reduce((acc, head) => acc && head))
    }
  }, [checked])

  return (
    <div className="select-information-form">
      <div className="select-information-header">
        <h2>Select Information</h2>
      </div>
      <div className="select-information-body">
        <div className="select-information-all-item">
          <div className="select-information-all-label">
            <label className="select-information-all-label-text">Select All</label>
          </div>
          <div className="select-information-all-checkbox">
            <label className="select-information-all-slider-label">
              <input className="select-information-all-input"
                     type="checkbox"
                     checked={allChecked}
                     onChange={handleSelectAll}/>
              <span className="select-information-all-slider"></span>
            </label>
          </div>
        </div>
        {data.map((platform,index) =>
        <div className="select-information-item" key={`item_${index}`}>
          <div className="select-information-label">
            <label className="select-information-label-text">
                {platform.name}: {platform.value}
            </label>
          </div>
          <div className="select-information-checkbox">
            <label className="select-information-slider-label">
              <input className="select-information-input"
                     id={index /* passed to update state */}
                     type="checkbox"
                     checked={checked[index] || false /* was triggering an
                     uncontrolled component warning without second part */}
                     onChange={e => handleCheckBox(e)} />
              <span className="select-information-slider"></span>
            </label>
          </div>
        </div>
        )}
        {data.length === 0 && token ? 
            <p className="select-information-no-info-message">
              You don&apos;t have any information yet! Add some on the Edit Information page.
            </p> 
            : <></>}
      </div>
      <div className="select-information-submit-item">
        <button className="select-information-submit-button" 
                type="button" 
                onClick={handleSubmit}>
          Generate My QR Code
       </button>
      </div>
    </div>
  )
}

export default SelectInformation
