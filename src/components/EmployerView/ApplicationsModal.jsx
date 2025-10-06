import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApplicationsModal.css';

const ApplicationsModal = ({ internshipId, onClose }) => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`https://hustle-baze-backend.onrender.com/api/internships/${internshipId}/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };

    if (internshipId) {
      fetchApplications();
    }
  }, [internshipId, token]);

  const handleFeedbackChange = async (applicationId, feedback, description) => {
    try {
      await axios.put(`https://hustle-baze-backend.onrender.com/api/applications/${applicationId}/feedback`, { feedback, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Error updating feedback:', err);
    }
  };

  const handleDownloadAll = () => {
    applications.forEach(app => {
      if (app.cv) window.open(app.cv, '_blank');
      if (app.coverLetter) window.open(app.coverLetter, '_blank');
    });
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Applications</h2>
          <button onClick={handleDownloadAll} className="download-button">
            Download All
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>School</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Feedback</th>
              <th>Description</th>
              <th>CV</th>
              <th>Cover Letter</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.applicationId}>
                <td>{app.name}</td>
                <td>{app.school}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>
                  <select
                    value={app.feedback}
                    onChange={(e) =>
                      handleFeedbackChange(app.applicationId, e.target.value, app.description)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={app.description}
                    onBlur={(e) =>
                      handleFeedbackChange(app.applicationId, app.feedback, e.target.value)
                    }
                  />
                </td>
                <td>
                  <a href={app.cv} target="_blank" rel="noopener noreferrer">
                    Download CV
                  </a>
                </td>
                <td>
                  <a href={app.coverLetter} target="_blank" rel="noopener noreferrer">
                    Download Cover
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', marginTop: '16px' }}>
          <button onClick={onClose} className="modal-close">
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default ApplicationsModal;
