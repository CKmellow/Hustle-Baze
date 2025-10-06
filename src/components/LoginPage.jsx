import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [signupData, setSignupData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    role: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');

    const rememberedEmail = JSON.parse(localStorage.getItem('user'))?.email;
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    if (token && user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === 'student') {
        navigate('/student');
      } else if (parsedUser.role === 'employer') {
        navigate('/employer');
      } else if (parsedUser.role === 'careerOfficer') {
        navigate('/career-dashboard');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    try {
      const response = await fetch('https://hustle-baze-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        toast.error(errorData.message);
        return;
      }

      const data = await response.json();
      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }

      const redirectTo = localStorage.getItem('redirectAfterLogin');
      if (redirectTo) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
        return;
      }

      if (data.user.role === 'student') {
        navigate('/student');
      } else if (data.user.role === 'employer') {
        navigate('/employer');
      } else if (data.user.role === 'careerOfficer') {
        navigate('/career-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Server error. Please try again later.');
      toast.error('Server error. Please try again later.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('https://hustle-baze-backend.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success('Signup successful! You can now log in.');
        setIsLogin(true);
        setSignupData({ fname: '', lname: '', email: '', password: '', role: '' });
        setConfirmPassword('');
      } else {
        setErrorMessage(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Server error. Please try again later.');
      toast.error('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="tabs">
        <div className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</div>
        <div className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Signup</div>
      </div>

      <h2>{isLogin ? 'Login' : 'Signup'}</h2>

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="form-group password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="forgot-password">
  Forgot Password?
</Link>
          </div>

          <button type="submit"><span>Login</span></button>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              value={signupData.fname}
              onChange={(e) => setSignupData({ ...signupData, fname: e.target.value })}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={signupData.lname}
              onChange={(e) => setSignupData({ ...signupData, lname: e.target.value })}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="form-group password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              placeholder="Enter Password"
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <div className="form-group password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <div className="form-group">
            <select
              value={signupData.role}
              onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button type="submit"><span>SignUp</span></button>
        </form>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default LoginPage;
