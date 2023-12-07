import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId); // Store user ID in local storage
        navigate("/home");
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

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
  );
};

export default Login;
