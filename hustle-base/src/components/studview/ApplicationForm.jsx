import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './ApplicationForm.css';

const ApplicationForm = ({setActivePage}) => {
  const { internshipId } = useParams();
  const location = useLocation();
  //const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  //const storedInternship = JSON.parse(localStorage.getItem('currentInternship'));
  
  // State for form data
  const [formData, setFormData] = useState({
    internship: internshipId || '',
    studentID: user?._id || '',
    status: 'pending',
    feedback: 'N/A',
    coverLetter: '',
    cv: '',
    applicationDate: new Date().toISOString(),
    internshipDetails: location.state?.internship || null
  });

  const [internshipOptions, setInternshipOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileUploading, setFileUploading] = useState(false);

  // Fetch internship options if this is a new application
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        if (!internshipId) {
          const response = await axios.get('http://localhost:5000/api/internships', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setInternshipOptions(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch internships');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [internshipId]);

  // If coming from internship page, pre-fill internship details
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
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    try {
      setFileUploading(true);
      const formData = new FormData();
      formData.append(field, file);

      const response = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setFormData(prev => ({ ...prev, [field]: response.data.filePath }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setFileUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.internship) {
      setError('Please select an internship');
      return;
    }

    if (!formData.coverLetter || !formData.cv) {
      setError('Both cover letter and CV are required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/applications',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

     setActivePage('Applications'); 
     localStorage.removeItem('currentInternship'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading application form...</p>
      </div>
    );
  }

  return (
    <div className="application-form-container">
      <h1>{internshipId ? 'Apply for Internship' : 'New Application'}</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!internshipId && (
          <div className="form-group">
            <label>Select Internship *</label>
            <select
              name="internship"
              value={formData.internship}
              onChange={handleChange}
              required
            >
              <option value="">-- Select an internship --</option>
              {internshipOptions.map(option => (
                <option key={option._id} value={option._id}>
                  {option.title} - {option.orgName}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.internshipDetails && (
          <div className="internship-details">
            <h3>Internship Details</h3>
            <p><strong>Title:</strong> {formData.internshipDetails.title}</p>
            <p><strong>Organization:</strong> {formData.internshipDetails.orgName}</p>
            <p><strong>Location:</strong> {formData.internshipDetails.location}</p>
            <p><strong>Deadline:</strong> {new Date(formData.internshipDetails.deadline).toLocaleDateString()}</p>
          </div>
        )}

        <div className="form-group">
          <label>Cover Letter *</label>
          {formData.coverLetter ? (
            <div className="file-uploaded">
              <span>Cover letter uploaded</span>
              <button 
                type="button" 
                onClick={() => window.open(`http://localhost:5000/${formData.coverLetter}`, '_blank')}
              >
                View
              </button>
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, coverLetter: '' }))}
              >
                Change
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 'coverLetter')}
              required
            />
          )}
          {fileUploading && formData.coverLetter === '' && <p>Uploading...</p>}
        </div>

        <div className="form-group">
          <label>CV *</label>
          {formData.cv ? (
            <div className="file-uploaded">
              <span>CV uploaded</span>
              <button 
                type="button" 
                onClick={() => window.open(`http://localhost:5000/${formData.cv}`, '_blank')}
              >
                View
              </button>
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, cv: '' }))}
              >
                Change
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 'cv')}
              required
            />
          )}
          {fileUploading && formData.cv === '' && <p>Uploading...</p>}
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
         <button 
          type="button" 
          onClick={() => {
            localStorage.removeItem('currentInternship');
            setActivePage(internshipId ? 'Internships' : 'Applications');
          }} 
          className="cancel-btn"
        >
          Cancel
        </button>
          <button type="submit" disabled={fileUploading} className="submit-btn">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;