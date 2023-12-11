import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import "./Login.css"

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/')
  })

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/login`, {
          email: email,
          password: password
        })
        .then(response => {
          localStorage.setItem('token', response.data.token)
          navigate('/home')
        })
        .catch(err => {
          console.error(err)
        })
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="submit-button">Login</button>
      </form>
      <button className="signup-button" onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
  )
}

export default Login
