import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployerInternships.css';
import ApplicationsModal from './ApplicationsModal';


const EmployerInternships = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    location: '',
    duration: '',
    stipend: '',
    description: '',
    requirements: '',
    type: '',
    experience: '',
    deadline: ''
  });

  const handleOpenApplicationsModal = (id) => {
    console.log("Opening modal for internship ID:", id);
    setSelectedInternshipId(id);
    setShowApplicationsModal(true);
  };

const handleCloseApplicationsModal = () => {
    setShowApplicationsModal(false);
    setSelectedInternshipId(null);
  };


  const fetchInternships = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/employers/${user._id}/internships`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInternships(res.data.internships || []);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchInternships();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const openCreateForm = () => {
    setIsEditing(false);
    setForm({
      title: '', location: '', duration: '', stipend: '',
      description: '', requirements: '', type: '', experience: '', deadline: ''
    });
    setShowForm(true);
  };

  const openEditForm = (internship) => {
    setIsEditing(true);
    setSelectedInternship(internship);
    setForm({
      title: internship.title,
      location: internship.location,
      duration: internship.duration,
      stipend: internship.stipend,
      description: internship.description,
      requirements: internship.requirements.join(', '),
      type: internship.type,
      experience: internship.experience,
      deadline: internship.deadline
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      requirements: form.requirements.split(',').map(r => r.trim())
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/internships/${selectedInternship._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/create/internships', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      fetchInternships();
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedInternship) return;
    try {
      await axios.delete(`http://localhost:5000/api/internships/${selectedInternship._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInternships();
      setSelectedInternship(null);
    } catch (err) {
      console.error('Error deleting internship:', err);
    }
  };

  if (loading) return <p className="internship-loading">Loading internships...</p>;

  return (
    <div className="internship-page">
      <div className="internship-header">
        <h2>My Internships</h2>
        <button className="create-button" onClick={openCreateForm}>+ Create Internship</button>
      </div>

      <div className="internship-grid">
        {internships.map((internship) => (
          <div
            className="internship-card"
            key={internship._id}
            onClick={() => setSelectedInternship(internship)}
          >
            <h3>{internship.title}</h3>
            <p><strong>Company:</strong> {internship.company}</p>
            <p><strong>Location:</strong> {internship.location}</p>
            <p><strong>Duration:</strong> {internship.duration}</p>
            <p><strong>Stipend:</strong> {internship.stipend}</p>
          </div>
        ))}
      </div>

      {selectedInternship && (
        <div className="internship-modal-overlay" onClick={() => setSelectedInternship(null)}>
          <div className="internship-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedInternship(null)}>×</button>
            <h3>{selectedInternship.title}</h3>
            <p><strong>Company:</strong> {selectedInternship.company}</p>
            <p><strong>Location:</strong> {selectedInternship.location}</p>
            <p><strong>Duration:</strong> {selectedInternship.duration}</p>
            <p><strong>Stipend:</strong> {selectedInternship.stipend}</p>
            <p><strong>Description:</strong> {selectedInternship.description}</p>
            <p><strong>Requirements:</strong> {selectedInternship.requirements.join(', ')}</p>
            <p className={selectedInternship.verified ? 'verified' : 'not-verified'}>
              {selectedInternship.verified ? '✔ Verified' : '✖ Not Verified'}
            </p>
            <div className="modal-actions">
              <button className="edit-btn" onClick={() => openEditForm(selectedInternship)}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
              <button
                className="view-applications-btn"
                onClick={() => {
                  localStorage.setItem("selectedInternshipId", selectedInternship._id);
                  window.dispatchEvent(new Event("openApplicationsPage")); // trigger event for EmployerLayout
                }}
              >
                View Applications
              </button>
            </div>
          </div>
        </div>
      )}

      {showApplicationsModal && selectedInternshipId && (
        <ApplicationsModal
          internshipId={selectedInternshipId}
          onClose={handleCloseApplicationsModal}
        />
      )}


      {showForm && (
        <div className="internship-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="internship-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            <h3>{isEditing ? 'Edit Internship' : 'Create Internship'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" value={form.title} placeholder="Title" onChange={handleChange} required />
              <input type="text" name="location" value={form.location} placeholder="Location" onChange={handleChange} required />
              <input type="text" name="duration" value={form.duration} placeholder="Duration" onChange={handleChange} required />
              <input type="text" name="stipend" value={form.stipend} placeholder="Stipend" onChange={handleChange} required />
              <textarea name="description" value={form.description} placeholder="Description" onChange={handleChange} required />
              <input type="text" name="requirements" value={form.requirements} placeholder="Requirements (comma separated)" onChange={handleChange} />
              <select name="type" value={form.type} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <select name="experience" value={form.experience} onChange={handleChange} required>
                <option value="">Select Experience Level</option>
                <option value="No Experience (Just Starting Out)">No Experience (Just Starting Out)</option>
                <option value="Project Experience">Project Experience</option>
                <option value="Previous Internship Experience">Previous Internship Experience</option>
                <option value="Part-Time or Freelance Experience">Part-Time or Freelance Experience</option>
                <option value="Multiple Internships / Advanced Experience">Multiple Internships / Advanced Experience</option>
              </select>
              <input
                type="date"
                name="deadline"
                value={form.deadline ? form.deadline.split('T')[0] : ''}
                min={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                required
              />
              <button type="submit" className="create-button">{isEditing ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default EmployerInternships;
