import React, { useEffect, useState } from 'react';

const CareerOfficerProfile = () => {
  const [formData, setFormData] = useState({
    StaffId: '',
    Name: '',
    OrgName: '',
    Phone: '',
    Email: '',
    description: ''
  });

  const [message, setMessage] = useState('');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const staffId = storedUser?.StaffId;

  useEffect(() => {
    fetch(`http://localhost:5000/api/career-office/${staffId}`)
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => console.error("Failed to fetch profile", err));
  }, [staffId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/api/career-office/${staffId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    setMessage(data.message || 'Update failed');
  };

  return (
    <div className="profile-page" style={{ padding: '2rem' }}>
      <h2>👤 Career Officer Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
        <input type="text" name="Name" value={formData.Name} onChange={handleChange} placeholder="Full Name" required />
        <input type="text" name="OrgName" value={formData.OrgName} onChange={handleChange} placeholder="Organization Name" required />
        <input type="text" name="Phone" value={formData.Phone} onChange={handleChange} placeholder="Phone Number" />
        <input type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows={4}></textarea>
        <button type="submit" style={{ backgroundColor: '#560BAD', color: 'white', padding: '10px', borderRadius: '5px' }}>Update Profile</button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </form>
    </div>
  );
};

export default CareerOfficerProfile;
