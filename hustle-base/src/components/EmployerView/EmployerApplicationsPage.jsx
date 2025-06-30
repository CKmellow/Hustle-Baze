import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApplicationsModal.css';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react'; // Icon

const EmployerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('token');
  const internshipId = localStorage.getItem("selectedInternshipId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/internships/${internshipId}/applications`, {
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
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/feedback`,
        { feedback, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error updating feedback:', err);
    }
  };

  const handleDownloadAll = () => {
    window.open(`http://localhost:5000/api/internships/${internshipId}/download-all`, "_blank");
  };

  return (
    <div className="applications-page">
      <div className="page-header">
        <h2>Applications</h2>
        <button onClick={handleDownloadAll} className="download-button">Download All</button>
        <button className="modal-close" onClick={() => navigate(-1)}>Back</button>
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
                <button
                  className="icon-button"
                  title="View CV"
                  onClick={() => window.open(`http://localhost:5000/${app.cv}`, "_blank")}
                >
                  <FileText size={18} />
                </button>
              </td>
              <td>
                <button
                  className="icon-button"
                  title="View Cover Letter"
                  onClick={() => window.open(`http://localhost:5000/${app.coverLetter}`, "_blank")}
                >
                  <FileText size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployerApplicationsPage;
