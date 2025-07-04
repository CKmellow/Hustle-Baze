import React, { useEffect, useState } from 'react';

const EmployerProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?._id || user?.userID;
  const [employerId, setEmployerId] = useState(null);
  const [form, setForm] = useState({
    fname: '',
    lname: '',
    email: '',
    company: '',
    location: '',
    contact: '',
    description: '',
    website: '', // ✅ added website field
    requestVerification: false
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) {
      setErrorMsg('User ID missing');
      return;
    }

    fetch(`http://localhost:5000/api/employers/by-user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const profile = data.data;
          setForm(profile);
          setEmployerId(profile._id);
        } else {
          setErrorMsg(data.message || 'Failed to load profile');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setErrorMsg('Server error');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    delete payload.email;

    try {
      const res = await fetch(`http://localhost:5000/api/employers/${employerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMsg('Profile updated successfully');
        setErrorMsg('');
      } else {
        setSuccessMsg('');
        setErrorMsg(result.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      setSuccessMsg('');
      setErrorMsg('Server error');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employer Profile</h2>
      {successMsg && <div className="text-green-600">{successMsg}</div>}
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>First Name</label>
          <input type="text" name="fname" value={form.fname} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Last Name</label>
          <input type="text" name="lname" value={form.lname} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Email</label>
          <input type="email" value={form.email} disabled className="w-full border p-2 rounded bg-gray-100 text-gray-500" />
        </div>

        <div>
          <label>Company</label>
          <input type="text" name="company" value={form.company} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label>Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Contact</label>
          <input type="text" name="contact" value={form.contact} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Website</label>
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="requestVerification" checked={form.requestVerification} onChange={handleChange} />
          <label className="ml-2">Request Verification</label>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
      </form>
    </div>
  );
};

export default EmployerProfile;
