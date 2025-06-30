import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react'; // icons
import './Applications.css';

const Applications = ({ setActivePage }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'newest'
  });
  const navigate = useNavigate();

  const handleNewApplication = () => {
    localStorage.setItem('currentApplication', JSON.stringify({ mode: 'new' }));
    setActivePage('ApplicationForm');
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/applications', {
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
    window.open(fileUrl, '_blank');
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading applications...</div>
      </div>
    );
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
        <button onClick={handleNewApplication} className="new-application-btn">
          + New Application
        </button>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by title or company"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="applications-grid">
        <div className="grid-header">
          <div>Internship</div>
          <div>Company</div>
          <div>Documents</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {applications.length > 0 ? (
          applications.map((application) => (
            <div key={application._id} className="application-row">
              <div>
                <h3>{application.internship?.title || 'N/A'}</h3>
                <p>{new Date(application.createdAt).toLocaleDateString()}</p>
              </div>

              <div>{application.internship?.company || 'N/A'}</div>

              <div className="documents-column">
                {application.coverLetter && (
                  <button onClick={() => downloadDocument(application.coverLetter)} title="View Cover Letter" className="icon-button">
                    <Eye size={16} /> <span>Cover</span>
                  </button>
                )}
                {application.cv && (
                  <button onClick={() => downloadDocument(application.cv)} title="View CV" className="icon-button">
                    <Eye size={16} /> <span>CV</span>
                  </button>
                )}
              </div>

              <div>{getStatusBadge(application.status || 'pending')}</div>

              <div className="actions-column">
                <button onClick={() => handleDelete(application._id)} className="icon-button delete-btn" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-applications">
            <p>No applications found. Start by creating a new application.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
