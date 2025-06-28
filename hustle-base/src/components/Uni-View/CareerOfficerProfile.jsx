import React, { useEffect, useState } from 'react';

const CareerOfficerProfile = () => {
  const [formData, setFormData] = useState({
    Name: '',
    OrgName: '',
    Phone: '',
    Email: '',
    description: '',
    _id: '', // Add _id to track officer ID for update
  });

  const [message, setMessage] = useState('');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?._id;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // ✅ Get the token

    try {
      const response = await fetch(`http://localhost:5000/api/career-officers/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ Send token
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
    <div className="profile-page" style={styles.container}>
      <h2 style={styles.heading}>👤 Career Officer Profile</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="Name" value={formData.Name} onChange={handleChange} placeholder="Full Name" required style={styles.input} />
        <input type="text" name="OrgName" value={formData.OrgName} onChange={handleChange} placeholder="Organization Name" required style={styles.input} />
        <input type="text" name="Phone" value={formData.Phone} onChange={handleChange} placeholder="Phone Number" style={styles.input} />
        <input type="email" name="Email" value={formData.Email} disabled placeholder="Email (locked)" style={{ ...styles.input, backgroundColor: '#eee' }} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows={4} style={styles.textarea}></textarea>
        <button type="submit" style={styles.button}>Update Profile</button>
        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    background: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    color: '#343a40',
    marginBottom: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '500px',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px'
  },
  button: {
    backgroundColor: '#560BAD',
    color: 'white',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  message: {
    color: 'green',
    fontWeight: 'bold'
  }
};

export default CareerOfficerProfile;
