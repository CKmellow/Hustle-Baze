import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentDash.css';

const StudentDash = () => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const studentID = user?._id;

  const [dashboardData, setDashboardData] = useState({
    profileCompletion: 0,
    applicationCounts: {
      pending: 0,
      accepted: 0,
      rejected: 0
    },
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentID) {
      setError("No student ID found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
      
        const response = await axios.get(
          `http://localhost:5000/api/student/${studentID}/application-status-counts`,
          { 
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        setDashboardData({
          profileCompletion: response.data.profileCompletion || 0,
          applicationCounts: {
            pending: response.data.pending || 0,
            accepted: response.data.accepted || 0,
            rejected: response.data.rejected || 0
          },
          alerts: response.data.alerts || []
        });
        
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [studentID]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="student-dashboard-container">
      <div className="welcome-header">
        <h2>Welcome, {user?.fname} {user?.lname}</h2>
        <p className="student-id">Student ID: {studentID}</p>
      </div>

      <div className="dashboard-card profile-card">
        <h3>Profile Completeness</h3>
        <div className="progress-container">
          <div className="progress-bar-background">
            <div 
              className="progress-bar-fill"
              style={{ width: `${dashboardData.profileCompletion}%` }}
            ></div>
          </div>
        </div>
        <p className="profile-completion-text">
          {dashboardData.profileCompletion}% complete
        </p>
        <button className="update-profile-btn">
          Update Profile
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card tile pending">
          <h4 className="card-title">Pending Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.pending}</p>
          <p className="card-subtext">Applications under review</p>
        </div>
        <div className="dashboard-card tile accepted">
          <h4 className="card-title">Accepted Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.accepted}</p>
          <p className="card-subtext">Successful applications</p>
        </div>
        <div className="dashboard-card tile rejected">
          <h4 className="card-title">Rejected Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.rejected}</p>
          <p className="card-subtext">Unsuccessful applications</p>
        </div>
      </div>

      <div className="dashboard-card alerts-card">
        <div className="alerts-header">
          <h3 className="card-title">Alerts</h3>
          <span className="alerts-badge">
            {dashboardData.alerts.length}
          </span>
        </div>
        <ul className="card-alerts">
          {dashboardData.alerts.length > 0 ? (
            dashboardData.alerts.map((alert, index) => (
              <li key={index} className="alert-item">
                <span className="alert-icon">!</span>
                {alert}
              </li>
            ))
          ) : (
            <li className="alert-item no-alerts">
              No new alerts
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentDash;