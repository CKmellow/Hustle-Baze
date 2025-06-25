import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { token } = useParams(); // token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset successful!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Reset failed');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      toast.error('Server error. Try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label className="show-password-toggle">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
