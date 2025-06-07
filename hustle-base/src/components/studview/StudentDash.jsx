import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentDash.css';

const StudentDash = ({ studentID }) => {
  const profileCompletion = 80; // You can also fetch this dynamically if needed

  const [applicationCounts, setApplicationCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alerts = [
    "Interview scheduled with Safaricom - 10 June",
    "Deadline for Microsoft application - 8 June",
  ];

  useEffect(() => {
  if (!studentID) return;

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const [pendingRes, acceptedRes, rejectedRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/student/${studentID}/status/pending`),
        axios.get(`http://localhost:5000/api/student/${studentID}/status/accepted`),
        axios.get(`http://localhost:5000/api/student/${studentID}/status/rejected`)
      ]);

      setApplicationCounts({
        pending: pendingRes.data.count,
        accepted: acceptedRes.data.count,
        rejected: rejectedRes.data.count
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch application counts");
    } finally {
      setLoading(false);
    }
  };

  fetchCounts();
}, [studentID]);


  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="student-dashboard-container">
      <h2>Student Dashboard</h2>

      <div className="dashboard-card profile-card">
        <h3 className="card-title">Profile Completeness</h3>
        <div className="progress-bar-background">
          <div
            className="progress-bar-fill"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
        <p className="profile-completion-text">{profileCompletion}% complete</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card tile pending">
          <h4 className="card-title">Pending Applications</h4>
          <p className="card-stat">{applicationCounts.pending}</p>
        </div>
        <div className="dashboard-card tile accepted">
          <h4 className="card-title">Accepted Applications</h4>
          <p className="card-stat">{applicationCounts.accepted}</p>
        </div>
        <div className="dashboard-card tile rejected">
          <h4 className="card-title">Rejected Applications</h4>
          <p className="card-stat">{applicationCounts.rejected}</p>
        </div>
      </div>

      <div className="dashboard-card alerts-card">
        <h3 className="card-title">Alerts</h3>
        <ul className="card-alerts">
          {alerts.map((alert, index) => (
            <li key={index} className="alert-item">
              {alert}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDash;
