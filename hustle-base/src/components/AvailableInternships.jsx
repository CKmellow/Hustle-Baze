import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AvailableInternships.css';

const AvailableInternships = () => {
  const [internships, setInternships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showExpiringSoon, setShowExpiringSoon] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    location: '',
    type: '',
    experience: '',
    duration: ''
  });
  const [allSkills, setAllSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  fetch('http://localhost:5000/api/internships')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setInternships(data);

        const now = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(now.getDate() + 14);

        const skillsSet = new Set();
        data.forEach(item => item.requirements?.forEach(req => skillsSet.add(req)));
        setAllSkills([...skillsSet]);

        // Apply initial filter based on showExpiringSoon
        const initialFiltered = data.filter(internship => {
          if (showExpiringSoon) {
            return (
              internship.deadline &&
              new Date(internship.deadline) >= now &&
              new Date(internship.deadline) <= twoWeeksLater
            );
          }
          return true;
        });

        setFiltered(initialFiltered);
      }
    });
}, [showExpiringSoon]); // <- depend on toggle state



  // const handleApplyClick = (internshipId) => {
  //   const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  //   const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

  //   if (!token || !user || user.role !== 'student') {
  //     localStorage.setItem('redirectAfterLogin', `/student/apply/${internshipId}`);
  //     navigate('/login');
  //   } else {
  //     navigate(`/student/apply/${internshipId}`);
  //   }
  // };
  const handleApplyClick = () => {
  navigate('/login');
};

  const handleFilterChange = (key, value) => {
    const updated = { ...selectedFilters };

    if (key === 'skills') {
      updated.skills = Array.isArray(value)
        ? value
        : updated.skills.includes(value)
          ? updated.skills.filter(s => s !== value)
          : [...updated.skills, value];
    } else {
      updated[key] = value;
    }

    setSelectedFilters(updated);

    const results = internships.filter(item => {
      const matchSkills = updated.skills.length === 0 || updated.skills.every(s => item.requirements?.includes(s));
      const matchLocation = !updated.location || item.location === updated.location;
      const matchType = !updated.type || item.type === updated.type;
      const matchExperience = !updated.experience || item.experience === updated.experience;
      const matchDuration = !updated.duration || item.duration === updated.duration;
      return matchSkills && matchLocation && matchType && matchExperience && matchDuration;
    });

    setFiltered(results);
  };
  const getDaysRemaining = (deadline) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

  return (
    <section className="internship-section">
      <h2 className="section-heading">🌟 Explore Internship Opportunities</h2>
<div className="filters-panel">
  <div className="dropdown-grid">
    <div className="filter-group">
      <label>Location</label>
      <select onChange={e => handleFilterChange('location', e.target.value)}>
        <option value=''>All</option>
        {[...new Set(internships.map(i => i.location))].map(loc => (
          <option key={loc}>{loc}</option>
        ))}
      </select>
    </div>

    <div className="filter-group">
      <label>Type</label>
      <select onChange={e => handleFilterChange('type', e.target.value)}>
        <option value=''>All</option>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Remote</option>
      </select>
    </div>

    <div className="filter-group">
      <label>Experience</label>
      <select onChange={e => handleFilterChange('experience', e.target.value)}>
        <option value=''>All</option>
        <option>Entry level</option>
        <option>Internship</option>
        <option>No experience</option>
      </select>
    </div>

    <div className="filter-group">
      <label>Duration</label>
      <select onChange={e => handleFilterChange('duration', e.target.value)}>
        <option value=''>All</option>
        {[...new Set(internships.map(i => i.duration))].map(duration => (
          <option key={duration}>{duration}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Skills section below the dropdowns */}
  <div className="skills-wrapper">
    <label>Skills</label>
    <div className="skills-buttons">
      {allSkills.map(skill => (
        <button
          key={skill}
          className={`skill-btn ${selectedFilters.skills.includes(skill) ? 'selected' : ''}`}
          onClick={() => handleFilterChange('skills', skill)}
        >
          {skill}
        </button>
      ))}
    </div>
  </div>
</div>
<div className="toggle-container">
  <button
    className={`toggle-btn ${showExpiringSoon ? 'active' : ''}`}
    onClick={() => setShowExpiringSoon(true)}
  >
    Expiring Soon
  </button>
  <button
    className={`toggle-btn ${!showExpiringSoon ? 'active' : ''}`}
    onClick={() => setShowExpiringSoon(false)}
  >
    View All
  </button>
</div>

<div className="internship-grid">
  {filtered.map(item => (
    <div className="internship-card large" key={item._id}>
      {item.deadline && getDaysRemaining(item.deadline) > 0 && (
        <div className="deadline-alert">
          📅 {getDaysRemaining(item.deadline)} Days Remaining
        </div>
      )}
      <h3>{item.title}</h3>
      <p><strong>Company:</strong> {item.company}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Type:</strong> {item.type} | <strong>Duration:</strong> {item.duration}</p>
      <p><strong>Experience:</strong> {item.experience}</p>
      <p className="internship-description">{item.description}</p>
      <p className="deadline"><strong>📅 Deadline:</strong> {new Date(item.deadline).toLocaleDateString()}</p>

      <div className="tag-container">
        {Array.isArray(item.requirements) ? (
          item.requirements.map((req, i) => (
            <span key={i} className="skill-tag">{req}</span>
          ))
        ) : (
          <span>No requirements listed</span>
        )}
      </div>

      <button onClick={() => handleApplyClick(item._id)}>Apply</button>
    </div>
  ))}
</div>


      {filtered.length === 0 && (
        <p style={{ marginTop: "2rem", color: "gray" }}>No internships match your selected filters.</p>
      )}
    </section>
  );
};

export default AvailableInternships;
