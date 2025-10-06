import React from 'react';
import { useNavigate } from 'react-router-dom';
import CareerOfficerProfile from './CareerOfficerProfile';
import './UniLayout.css';
import { ArrowLeft } from 'lucide-react';

const CareerOfficerProfileLayout = () => {
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
            <span>👤 My Profile</span>
          </div>
        </header>

        <CareerOfficerProfile />
      </main>
    </div>
  );
};

export default CareerOfficerProfileLayout;
