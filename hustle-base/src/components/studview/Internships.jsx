import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Internships.css';

const Internships = ({setActivePage}) => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    orgName: '',
    deadline: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/filter/internships', {
          params: filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setInternships(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch internships');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [filters]);

   const handleApplyNow = (internship) => {
    // Save internship to localStorage before navigating
    localStorage.setItem('currentApplication', JSON.stringify({
      internshipId: internship._id,
      internshipDetails: internship,
      mode: 'apply'
    }));
    setActivePage('ApplicationForm');
  };

  const handleApply = (internshipId) => {
    navigate(`/apply/${internshipId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading internships...</p>
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
    <div className="internships-container">
      <div className="internships-header">
        <h1>Available Internships</h1>
      </div>

      <div className="filters-container">
        <div className="filter">
          <input
            type="text"
            name="title"
            placeholder="Search by title"
            value={filters.title}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter">
          <input
            type="text"
            name="location"
            placeholder="Search by location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter">
          <input
            type="text"
            name="orgName"
            placeholder="Search by organization"
            value={filters.orgName}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter">
          <input
            type="date"
            name="deadline"
            placeholder="Filter by deadline"
            value={filters.deadline}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="internships-grid">
        {internships.length > 0 ? (
          internships.map((internship) => (
            <div key={internship._id} className="internship-card">
              <div className="card-header">
                <h3>{internship.title}</h3>
                <span className="organization">{internship.orgName}</span>
              </div>
              <div className="card-body">
                <p className="location">
                  <i className="fas fa-map-marker-alt"></i> {internship.location}
                </p>
                <p className="description">{internship.description}</p>
                <div className="details">
                  <div className="detail-item">
                    <span>Stipend:</span>
                    <span>${internship.stipend || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span>Duration:</span>
                    <span>{internship.duration} months</span>
                  </div>
                  <div className="detail-item">
                    <span>Deadline:</span>
                    <span className={new Date(internship.deadline) < new Date() ? 'expired' : ''}>
                      {formatDate(internship.deadline)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  onClick={() => handleApplyNow(internship)}
                  className="apply-btn"
                  disabled={new Date(internship.deadline) < new Date()}
                >
                  {new Date(internship.deadline) < new Date() ? 'Expired' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-internships">
            <p>No internships found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;