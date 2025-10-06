import React, { useState } from 'react';
import './LoginPage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    const response = await fetch('https://hustle-baze-backend.onrender.com/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (response.ok) {
      setMessage('📧 Check your email for a reset link.');
    } else {
      setMessage(data.message || 'Something went wrong.');
    }
  };

  return (
    <div className="login-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleReset}>
        <input 
          type="email" 
          placeholder="Enter your registered email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="info-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
