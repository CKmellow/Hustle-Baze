import React, { useEffect, useState } from 'react';
import './CareerOfficerProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faPhone, faEnvelope, faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const CareerOfficerProfile = () => {
  const [formData, setFormData] = useState({
    Name: '',
    OrgName: '',
    Phone: '',
    Email: '',
    description: '',
    _id: '',
  });

  const [message, setMessage] = useState('');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?._id;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/career-officers/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("✅ Profile updated successfully");
      } else {
        setMessage(result.message || "❌ Update failed");
      }
    } catch (err) {
      console.error("Error updating profile", err);
      setMessage("⚠️ Server error");
    }
  };

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/career-officers/by-user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const user = data.data;
          setFormData({
            ...user,
            Name: `${user.fname} ${user.lname}`,
            Email: user.email
          });
        } else {
          console.error(data.message);
        }
      })
      .catch(err => console.error("Failed to fetch profile", err));
  }, [userId]);

  return (
    <div className="profile-page">
      <h2 className="profile-title"><FontAwesomeIcon icon={faUser} /> Career Officer Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input type="text" name="Name" value={formData.Name} onChange={handleChange} placeholder="Full Name" required />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faBuilding} className="input-icon" />
          <input type="text" name="OrgName" value={formData.OrgName} onChange={handleChange} placeholder="Organization Name" required />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faPhone} className="input-icon" />
          <input type="text" name="Phone" value={formData.Phone} onChange={handleChange} placeholder="Phone Number" />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input type="email" name="Email" value={formData.Email} disabled placeholder="Email (locked)" />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faCommentDots} className="input-icon" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows={4}></textarea>
        </div>

        <button type="submit" className="submit-button">
          <FontAwesomeIcon icon={faPaperPlane} /> Update Profile
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default CareerOfficerProfile;
