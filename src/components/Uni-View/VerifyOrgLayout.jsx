import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VerifyOrganizations from './VerifyOrganizations';
import './UniLayout.css'; 
import './VerifyOrganizations.css'; // Optional: for styling

const VerifyOrgLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="career-dashboard">
      <aside className="sidebar">
        <h2>Career Portal</h2>
        <nav>
          <ul>
            <li>
              <a href="#" onClick={() => navigate('/career-dashboard')}>
                ← Back to Dashboard
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="left-section" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </div>
          <div className="right-section">
            <span>🧾 Organization Verification</span>
          </div>
        </header>

        <div className="fun-analytics-section">
          <h1>👥 Verify Organizations</h1>
          <VerifyOrganizations />
        </div>
      </main>
    </div>
  );
};

export default VerifyOrgLayout;
