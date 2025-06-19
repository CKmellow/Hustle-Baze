import React, { useEffect, useState } from 'react';
import './VerifyOrganizations.css'; // Optional: for styling

const VerifyOrganizations = () => {
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/employers')
      .then(res => res.json())
      .then(data => setEmployers(data))
      .catch(err => console.error("Failed to load employers", err));
  }, []);

  const handleVerify = (id) => {
    alert(`Verified employer with ID: ${id}`);
    // TODO: send PATCH request to mark as verified
  };

  const handleReport = (id) => {
    alert(`Reported employer with ID: ${id}`);
    // TODO: send POST request to flag as suspicious
  };

  return (
    <div className="verify-orgs">
      <h2>Verify Organizations</h2>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Email</th>
            <th>Website</th>
            <th>Contact</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.map(emp => (
            <tr key={emp._id}>
              <td>{emp.company}</td>
              <td>{emp.email}</td>
              <td><a href={emp.website} target="_blank" rel="noreferrer">{emp.website}</a></td>
              <td>{emp.contact}</td>
              <td>{emp.description}</td>
              <td>
                <button onClick={() => handleVerify(emp._id)}>✅ Verify</button>
                <button onClick={() => handleReport(emp._id)}>🚩 Report</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerifyOrganizations;
