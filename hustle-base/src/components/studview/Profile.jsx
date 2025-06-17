import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ setActivePage }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [profileData, setProfileData] = useState({
    fname: '',
    lname: '',
    email: '',
    studentID: '',
    dob: '',
    phone: '',
    course: '',
    yearOfStudy: '',
    OrgName: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/students/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setProfileData(response.data.data);
      } else {
        setError(response.data.message || "Failed to load profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      
      const response = await axios.put(
        `http://localhost:5000/api/students/${user._id}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => setSuccess(null), 3000);
        // Refresh profile data
        fetchProfile();
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="fname"
              value={profileData.fname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lname"
              value={profileData.lname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profileData.email}
              readOnly
              disabled
              className="disabled-field"
            />
          </div>

          <div className="form-group">
            <label>Student ID *</label>
            <input
              type="text"
              name="studentID"
              value={profileData.studentID}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={profileData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Course</label>
            <input
              type="text"
              name="course"
              value={profileData.course}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Year of Study</label>
            <select
              name="yearOfStudy"
              value={profileData.yearOfStudy}
              onChange={handleChange}
            >
              <option value="">Select year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
              <option value="5+">Fifth Year or Above</option>
            </select>
          </div>

          <div className="form-group">
            <label>Organization Name *</label>
            <input
              type="text"
              name="OrgName"
              value={profileData.OrgName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={profileData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => setActivePage('Dashboard')} 
            className="cancel-btn"
          >
            Back to Dashboard
          </button>
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;