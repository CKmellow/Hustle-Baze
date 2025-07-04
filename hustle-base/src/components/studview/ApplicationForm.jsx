import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import './ApplicationForm.css';

const ApplicationForm = ({ setActivePage }) => {
  const { internshipId } = useParams();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    internship: internshipId || '',
    studentID: user?._id || '',
    // status: 'pending',
    feedback: 'N/A',
    coverLetter: '',
    cv: '',
    applicationDate: new Date().toISOString(),
    internshipDetails: null
  });

  const [companies, setCompanies] = useState([]);
  const [internshipOptions, setInternshipOptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('currentApplication');
    const parsed = stored ? JSON.parse(stored) : null;

    if (parsed && parsed.internshipId) {
      setFormData(prev => ({
        ...prev,
        internship: parsed.internshipId,
        internshipDetails: parsed.internshipDetails
      }));
    }
  }, []);

  useEffect(() => {
    if (internshipId && location.state?.internship) {
      setFormData(prev => ({
        ...prev,
        internship: internshipId,
        internshipDetails: location.state.internship
      }));
    }
  }, [internshipId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    try {
      setFileUploading(true);
      const data = new FormData();
      data.append(field, file);
      const response = await axios.post('http://localhost:5000/api/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFormData(prev => ({ ...prev, [field]: response.data.filePath }));
    } catch {
      setError('Upload failed');
    } finally {
      setFileUploading(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.internship || !formData.coverLetter || !formData.cv) {
    setError('Internship, Cover Letter and CV required');
    return;
  }
  try {
    await axios.post('http://localhost:5000/api/create/applications', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    localStorage.removeItem('currentApplication');
    setActivePage('Applications');
  } catch (err) {
    if (err.response?.status === 409) {
      setError('You have already applied for this internship');
    } else {
      setError('Application submission failed');
    }
  }
};


  return (
    <div className="application-form-container">
      <h1>{internshipId ? 'Apply for Internship' : 'New Application'}</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        
        {formData.internshipDetails && (
          <div className="internship-details">
            <h3>Internship Details</h3>
            <p><strong>Title:</strong> {formData.internshipDetails.title}</p>
            <p><strong>Company:</strong> {formData.internshipDetails.company}</p>
            <p><strong>Location:</strong> {formData.internshipDetails.location}</p>
            <p><strong>Deadline:</strong> {new Date(formData.internshipDetails.deadline).toLocaleDateString()}</p>
          </div>
        )}

        <div className="form-group">
          <label>Cover Letter *</label>
          {formData.coverLetter ? (
            <div className="file-uploaded">
              <span>Uploaded</span>
              <button type="button" onClick={() => window.open(`http://localhost:5000/${formData.coverLetter}`)}>View</button>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, coverLetter: '' }))}>Change</button>
            </div>
          ) : (
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'coverLetter')} required />
          )}
        </div>

        <div className="form-group">
          <label>CV *</label>
          {formData.cv ? (
            <div className="file-uploaded">
              <span>Uploaded</span>
              <button type="button" onClick={() => window.open(`http://localhost:5000/${formData.cv}`)}>View</button>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, cv: '' }))}>Change</button>
            </div>
          ) : (
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'cv')} required />
          )}
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea name="feedback" value={formData.feedback} onChange={handleChange} rows="4" />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              localStorage.removeItem('currentApplication');
              setActivePage(internshipId ? 'Internships' : 'Applications');
            }}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={fileUploading}>Submit Application</button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
