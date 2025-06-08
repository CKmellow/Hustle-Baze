import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentDash.css';
import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context

const StudentDash = () => {
  const { currentUser } = useAuth(); // Get current user from auth context
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
    if (!currentUser?.studentID) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/student/${currentUser.studentID}/application-status-counts`,
          { withCredentials: true } // Include cookies if using session auth
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
  }, [currentUser]);

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
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="student-dashboard-container">
      <h2>Student Dashboard</h2>

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
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card tile pending">
          <h4 className="card-title">Pending Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.pending}</p>
        </div>
        <div className="dashboard-card tile accepted">
          <h4 className="card-title">Accepted Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.accepted}</p>
        </div>
        <div className="dashboard-card tile rejected">
          <h4 className="card-title">Rejected Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.rejected}</p>
        </div>
      </div>

      <div className="dashboard-card alerts-card">
        <h3 className="card-title">Alerts</h3>
        <ul className="card-alerts">
          {dashboardData.alerts.length > 0 ? (
            dashboardData.alerts.map((alert, index) => (
              <li key={index} className="alert-item">{alert}</li>
            ))
          ) : (
            <li className="alert-item">No new alerts</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentDash;