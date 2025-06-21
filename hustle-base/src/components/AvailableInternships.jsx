import React, { useEffect, useState } from 'react';
import './AvailableInternships.css';

const AvailableInternships = () => {
  const [internships, setInternships] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/api/internships")
      .then(res => res.json())
      .then(data => setInternships(data))
      .catch(err => console.error("Failed to load internships", err));
  }, []);

  const filteredInternships = internships.filter(intern => 
    filter === "all" ? true : intern.location.toLowerCase() === filter
  );

  return (
    <section className="internships-section">
      <h2>🚀 Explore Internships</h2>
      <p>Opportunities tailored just for you. Apply now and grow your career!</p>

      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("remote")} className={filter === "remote" ? "active" : ""}>Remote</button>
        <button onClick={() => setFilter("onsite")} className={filter === "onsite" ? "active" : ""}>Onsite</button>
        <button onClick={() => setFilter("hybrid")} className={filter === "hybrid" ? "active" : ""}>Hybrid</button>
      </div>

      <div className="internship-list">
        {filteredInternships.map((intern, i) => (
          <div className="internship-card fade-in" key={intern._id || i}>
            <h3>{intern.title}</h3>
            <p><strong>Company:</strong> {intern.company}</p>
            <p><strong>Location:</strong> {intern.location}</p>
            <p>{intern.description}</p>
            <span className={`badge ${intern.location.toLowerCase()}`}>{intern.location}</span>
            <a href="#" className="apply-btn">Apply Now</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AvailableInternships;
