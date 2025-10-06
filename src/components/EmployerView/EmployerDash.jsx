import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './EmployerDash.css';

const EmployerDash = ({ setActivePage }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const employerID = user?._id;

  const [dashboardData, setDashboardData] = useState({
    internshipCount: 0,
    applicationCounts: {
      approved: 0,
      rejected: 0,
      pending: 0
    },
    profileCompletion: 0,
    missingFields: {
      required: [],
      optional: []
    },
    lastUpdated: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!employerID) {
      setError("No employer ID found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [statusRes, profileRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/employers/${employerID}/application-status-counts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`http://localhost:5000/api/employers/${employerID}/completion`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setDashboardData({
        internshipCount: statusRes.data.internshipCount || 0,
        applicationCounts: statusRes.data.applicationCounts || { pending: 0, approved: 0, rejected: 0 },
        profileCompletion: profileRes.data.profileCompletion || 0,
        missingFields: profileRes.data.missingFields || { required: [], optional: [] },
        lastUpdated: profileRes.data.lastUpdated || null
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [employerID]);

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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchDashboardData} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="employer-dashboard-container">
      <div className="welcome-header">
        <h2>Welcome, {user?.fname} {user?.lname}</h2>
        <p className="employer-id">Employer ID: {employerID}</p>
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
              {dashboardData.missingFields.required.length > 0
                ? ' Complete required fields'
                : ' Add optional details to improve your profile'}
            </span>
          )}
        </p>
        <button
          className="update-profile-btn"
          onClick={handleUpdateProfile}
        >
          {dashboardData.profileCompletion < 100
            ? 'Complete Profile'
            : 'Update Profile'}
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card tile internships">
          <h4>Total Internships</h4>
          <p className="card-stat">{dashboardData.internshipCount}</p>
          <p className="card-subtext">Internships posted</p>
        </div>
        <div className="dashboard-card tile approved">
          <h4>Approved Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.approved}</p>
          <p className="card-subtext">Applications approved</p>
        </div>
        <div className="dashboard-card tile rejected">
          <h4>Rejected Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.rejected}</p>
          <p className="card-subtext">Applications declined</p>
        </div>
        <div className="dashboard-card tile pending">
          <h4>Pending Applications</h4>
          <p className="card-stat">{dashboardData.applicationCounts.pending}</p>
          <p className="card-subtext">Under review</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerDash;
