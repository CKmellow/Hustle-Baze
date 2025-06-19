import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViewAnalytics from './ViewAnalytics'; // ✅ Import chart component
import './UniLayout.css'; // Or your custom style file

const AnalyticsLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="career-dashboard">
      <aside className="sidebar">
        <h2>Career Portal</h2>
        <nav>
          <ul>
            <li>
              <a href="#" onClick={() => navigate('/career-dashboard')}>← Back to Dashboard</a>
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
            <span>📊 Internship Analytics</span>
          </div>
        </header>

        {/* ✅ Feed in the graph here */}
        <div className="fun-analytics-section">
          <h1>📈 Application Status Breakdown</h1>
          <p>Visualize the performance of internship applications.</p>
          <ViewAnalytics />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsLayout;
