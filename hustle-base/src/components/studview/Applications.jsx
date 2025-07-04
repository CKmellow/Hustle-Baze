import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Trash2 } from 'lucide-react';
import './Applications.css';

const Applications = ({ setActivePage }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    feedback: '',
    sortBy: 'newest'
  });

  // const handleNewApplication = () => {
  //   localStorage.setItem('currentApplication', JSON.stringify({ mode: 'new' }));
  //   setActivePage('ApplicationForm');
  // };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/fetch/applications', {
          params: filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setApplications(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setApplications(applications.filter(app => app._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete application');
    }
  };

  const downloadDocument = (fileUrl) => {
    if (!fileUrl) return;
    window.open(`http://localhost:5000/${fileUrl}`, '_blank'); 
  };

  const getfeedbackBadge = (feedback) => {
    const feedbackClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${feedbackClasses[feedback]}`}>
        {feedback.charAt(0).toUpperCase() + feedback.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div className="loading-container">Loading applications...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h1>My Applications</h1>
        {/* <button onClick={handleNewApplication} className="new-application-btn">
          + New Application
        </button> */}
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by title or company"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select value={filters.feedback} onChange={(e) => setFilters({ ...filters, feedback: e.target.value })}>
          <option value="">All feedbackes</option>
          <option value="pending">Pending</option>
          <option value="approved">approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="applications-grid">
        <div className="grid-header">
          <div>Internship</div>
          <div>Company</div>
          <div>Deadline</div>
          <div>Documents</div>
          <div>feedback</div>
          <div>Actions</div>
        </div>

        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} className="application-row">
              <div>{app.internship?.title }</div>
              <div>{app.internship?.company }</div>
              <div>{app.internship?.deadline ? new Date(app.internship.deadline).toLocaleDateString() : 'N/A'}</div>

              <div className="documents-column">
                {app.coverLetter && (
                  <button onClick={() => downloadDocument(app.coverLetter)} title="View Cover Letter" className="icon-button">
                    <Eye size={16} /> <span>Cover</span>
                  </button>
                )}
                {app.cv && (
                  <button onClick={() => downloadDocument(app.cv)} title="View CV" className="icon-button">
                    <Eye size={16} /> <span>CV</span>
                  </button>
                )}
              </div>

              <div>{getfeedbackBadge(app.feedback || 'pending')}</div>

              <div className="actions-column">
                <button onClick={() => handleDelete(app._id)} className="icon-button delete-btn" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-applications">No applications found. Start by creating a new one.</div>
        )}
      </div>
    </div>
  );
};

export default Applications;
