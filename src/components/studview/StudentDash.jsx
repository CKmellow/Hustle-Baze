import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './StudentDash.css';

const StudentDash = ({ setActivePage }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const studentID = user?._id;

  const [dashboardData, setDashboardData] = useState({
    profileCompletion: 0,
    missingFields: {
      required: [],
      optional: []
    },
    applicationCounts: {
      pending: 0,
      approved: 0,
      rejected: 0
    },
    alerts: [],
    lastUpdated: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    if (!studentID) {
      setError("No student ID found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [countsResponse, completionResponse] = await Promise.all([
        axios.get(`https://hustle-baze-backend.onrender.com/api/student/${studentID}/application-status-counts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).catch(err => ({ 
          data: { 
            pending: 0, 
            approved: 0, 
            rejected: 0, 
            alerts: [] 
          } 
        })),
        
        
        axios.get(`https://hustle-baze-backend.onrender.com/api/students/${studentID}/completion`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).catch(err => ({ 
          data: { 
            success: false,
            profileCompletion: 0, 
            missingFields: { required: [], optional: [] }
          }
        }))
      ]);

      setDashboardData({
        profileCompletion: completionResponse.data.success ? 
          completionResponse.data.profileCompletion : 0,
        missingFields: completionResponse.data.success ?
          completionResponse.data.missingFields : 
          { required: [], optional: [] },
        applicationCounts: {
          pending: countsResponse.data.pending || 0,
          approved: countsResponse.data.approved || 0,
          rejected: countsResponse.data.rejected || 0
        },
        alerts: countsResponse.data.alerts || [],
        lastUpdated: completionResponse.data.lastUpdated || null
      });

    } catch (err) {
      console.error("Dashboard error:", err);
      if (retryCount < 3) {
        setTimeout(() => setRetryCount(prev => prev + 1), 2000);
      } else {
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to load dashboard data. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [studentID, retryCount]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateProfile = () => {
    setActivePage('Profile');
  };

  const getCompletionColor = (percentage) => {
    if (percentage < 40) return '#ef4444';
    if (percentage < 80) return '#f59e0b';
    return '#10b981';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
        {retryCount > 0 && <p>Attempt {retryCount + 1} of 3</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => {
            setRetryCount(0);
            fetchDashboardData();
          }}
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
        {dashboardData.lastUpdated && (
          <p className="last-updated">
            Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      <div className="dashboard-card profile-card">
        <h3>Profile Completeness</h3>
        <div className="progress-container">
          <div className="progress-bar-background">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${dashboardData.profileCompletion}%`,
                backgroundColor: getCompletionColor(dashboardData.profileCompletion)
              }}
            ></div>
          </div>
        </div>
        <p className="profile-completion-text">
          {dashboardData.profileCompletion}% complete
          {dashboardData.profileCompletion < 100 && (
            <span className="completion-hint">
              {dashboardData.missingFields.required.length > 0 ? 
                ' Complete required fields' : 
                ' Add optional details to improve your profile'}
            </span>
          )}
        </p>
        
        {dashboardData.missingFields.required.length > 0 && (
          <div className="missing-fields">
            <strong>Missing required:</strong> 
            {dashboardData.missingFields.required.join(', ')}
          </div>
        )}
        
        <button 
          className="update-profile-btn"
          onClick={handleUpdateProfile}
        >
          {dashboardData.profileCompletion < 100 ? 
            'Complete Profile' : 
            'Update Profile'}
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card tile pending">
          <h4 className="card-title">Pending Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.pending}</p>
          <p className="card-subtext">Applications under review</p>
        </div>
        <div className="dashboard-card tile approved">
          <h4 className="card-title">approved Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.approved}</p>
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