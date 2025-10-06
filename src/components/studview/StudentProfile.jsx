import React, { useEffect, useState } from 'react';

const StudentProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.userID || user?._id;
  const [studentId, setStudentId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
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


  useEffect(() => {
    if (!id) {
      setErrorMsg('User ID missing');
      return;
    }

    fetch(`https://hustle-baze-backend.onrender.com/api/students/by-user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const profile = data.data;
          profile.dob = profile.dob ? profile.dob.split('T')[0] : '';
          setForm(profile);
          setStudentId(profile._id); // Save student Mongo _id
        } else {
          setErrorMsg(data.message || 'Failed to load profile');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setErrorMsg('Server error');
      });
  }, [id]);

  const is18OrOlder = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!is18OrOlder(form.dob)) {
      setErrorMsg("You must be at least 18 years old.");
      return;
    }

    const payload = { ...form };
    delete payload.email; // Not editable

    try {
      const response = await fetch(`https://hustle-baze-backend.onrender.com/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
  setSuccessMsg('Profile updated successfully');
  setErrorMsg('');
} else {
  setSuccessMsg('');
  setErrorMsg(result.message || 'Failed to update profile');
}
    } catch (err) {
      console.error('Submit error:', err);
      setSuccessMsg('');
setErrorMsg('Server error while updating profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>

      {successMsg && <div className="success-message">{successMsg}</div>}
{errorMsg && <div className="error-message">{errorMsg}</div>}


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="fname"
            value={form.fname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lname"
            value={form.lname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label>Student ID</label>
          <input
            type="text"
            name="studentID"
            value={form.studentID}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={form.course}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Year of Study</label>
          <input
            type="text"
            name="yearOfStudy"
            value={form.yearOfStudy}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Organization Name</label>
          <input
            type="text"
            name="OrgName"
            value={form.OrgName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default StudentProfile;