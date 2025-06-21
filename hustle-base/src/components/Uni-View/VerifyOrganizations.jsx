import React, { useEffect, useState } from 'react';
import './VerifyOrganizations.css';

const VerifyOrganizations = () => {
  const [employers, setEmployers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/employers')
      .then(res => res.json())
      .then(data => setEmployers(data))
      .catch(err => console.error("Failed to load employers", err));
  }, []);

  const handleVerify = async (id) => {
    const confirmVerify = window.confirm("Are you sure you want to verify this employer?");
    if (!confirmVerify) return;

    try {
      const response = await fetch(`http://localhost:5000/api/employers/${id}/verify`, {
        method: 'PATCH',
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setEmployers(prev => prev.map(emp =>
          emp._id === id ? { ...emp, verified: true, reported: false } : emp
        ));
      } else {
        alert(data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Server error during verification.");
    }
  };

  const handleReport = async (id) => {
    const confirmReport = window.confirm("Are you sure you want to report this employer?");
    if (!confirmReport) return;

    try {
      const response = await fetch(`http://localhost:5000/api/employers/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: "Suspicious behavior reported by admin"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setEmployers(prev => prev.map(emp =>
          emp._id === id ? { ...emp, verified: false, reported: true } : emp
        ));
      } else {
        alert(data.message || "Failed to report employer.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error while reporting employer.");
    }
  };

  const filteredEmployers = employers.filter(emp => {
    if (filter === 'verified') return emp.verified === true;
    if (filter === 'reported') return emp.reported === true;
    return emp.verified === false && !emp.reported; // Default: unreviewed
  });

  return (
    <div className="verify-orgs">
      <h2>Verify Organizations</h2>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'verified' ? 'active' : ''} onClick={() => setFilter('verified')}>✅ Verified</button>
        <button className={filter === 'reported' ? 'active' : ''} onClick={() => setFilter('reported')}>🚩 Reported</button>
      </div>

      {filteredEmployers.length === 0 ? (
        <p>No employers to display.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Website</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployers.map(emp => (
              <tr key={emp._id}>
                <td>{emp.company}</td>
                <td>{emp.email}</td>
                <td><a href={emp.website} target="_blank" rel="noreferrer">{emp.website}</a></td>
                <td>{emp.contact}</td>
                <td>
                  {emp.verified ? (
                    <span className="badge verified">✅ Verified</span>
                  ) : emp.reported ? (
                    <span className="badge reported">🚩 Reported</span>
                  ) : (
                    <span className="badge pending">⏳ Pending</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleVerify(emp._id)} className="btn-verify">Verify</button>
                  <button onClick={() => handleReport(emp._id)} className="btn-report">Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerifyOrganizations;
