import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { toast } from 'sonner';
import NavBar from './NavBar';

const LoginPage = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
const [signupData, setSignupData] = useState({
    fname: '',
    lname: '',
    _id: '',
    email: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = {email, password };

    try {
      const response = await fetch('http://localhost:5000/login', { 
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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Login successful:', data);

      console.log('token:', data.token);
      console.log('user:', data.user);

  
      // Redirect based on role
      if (data.user.role === 'student') {
        navigate('/student');
      } else if (data.user.role === 'employer') {
        navigate('/employer');
      } else if (data.user.role === 'CareerOfficer') {
        navigate('/staff');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Server error. Please try again later.');
      toast.error('Server error. Please try again later.');
    }
  };
  

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setErrorMessage('Signup successful! You can now log in.');
        toast.success('Signup successful! You can now log in.');

        // Switch to login tab after successful signup
        setIsLogin(true);
        // Optionally clear the signup form
        setSignupData({
          fname: '',
          lname: '',
          _id: '',
          email: '',
          password: '',
          role: '',
        });
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
      {/* Tabs for toggling between Login and Signup */}
      <div className="tabs">
        <div
          className={`tab ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </div>
        <div
          className={`tab ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </div>
      </div>

      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      {isLogin ? (
        <form onSubmit={handleLogin}>
         <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
          
          <button type="submit"><span>Login</span></button>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={signupData.fname}
            onChange={(e) => setSignupData({ ...signupData, fname: e.target.value })}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            value={signupData.lname}
            onChange={(e) => setSignupData({ ...signupData, lname: e.target.value })}
            placeholder="Last Name"
            required
          />
          <input
            type="text"
            value={signupData._id}
            onChange={(e) => setSignupData({ ...signupData, _id: e.target.value })}
            placeholder="Enter ID"
            required
          />

          <input
            type="email"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            placeholder="Enter Email"
            required
          />
          <input
            type="password"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            placeholder="Enter Password"
            required
          />
          <select
            value={signupData.role}
            onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="employer">Employer</option>
            {/* <option value="careersOffice">Career's office</option> */}
          </select>
         <button type="submit"><span>SignUp</span></button>
        </form>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
 
  );
};

export default LoginPage;
