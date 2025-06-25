import React, { useState, useEffect } from 'react';
import ViewAnalytics from './ViewAnalytics';
import Lottie from 'lottie-react';
import pointerAnimation from '../animations/Alert.json';
import Topbar from '../studview/Topbar';
import { Home, Users, BarChart2, LogOut, UserCircle } from 'lucide-react';
import './UniLayout.css';
import { useNavigate } from 'react-router-dom';
import VerifyOrganizations from './VerifyOrganizations';
import CareerOfficerProfile from './CareerOfficerProfile';
 // Create if not already

const UniLayout = () => {
  const [user, setUser] = useState({ fname: '', lname: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return null; // Already rendered
      case "analytics":
        return <ViewAnalytics />;
      case "profile":
        return <CareerOfficerProfile />;
      case "verify":
        return <VerifyOrganizations />;
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="career-layout">
      <Topbar />
      <div className="career-dashboard">
        <aside className="sidebars">
          <h2>Career Portal</h2>
          <nav>
            <ul>
              <li>
                <a onClick={() => setActivePage("dashboard")}><Home size={18} /> Dashboard</a>
              </li>
              <li>
                <a onClick={() => setActivePage("profile")}><UserCircle size={18} /> My Profile</a>
              </li>
              <li>
                <a onClick={() => setActivePage("verify")}><Users size={18} /> Verify Organizations</a>
              </li>
              <li>
                <a onClick={() => setActivePage("analytics")}><BarChart2 size={18} /> Internship Analytics</a>
              </li>
              <li>
                <a onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  navigate('/login');
                }}><LogOut size={18} /> Logout</a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="career-main">
          <h1 className="career-heading">Welcome, {user?.fname} {user?.lname}!</h1>

          {activePage === "dashboard" && (
            <section className="career-dashboard-section">
              {/* ✅ Grid of Cards */}
              <div className="career-cards-grid">
                <div className="career-card card-pending">
                  <h4>Organizations Verified</h4>
                  <p className="card-stat">12</p>
                  <p className="card-subtext">Successfully Approved</p>
                </div>
                <div className="career-card card-rejected">
                  <h4>Organizations Rejected</h4>
                  <p className="card-stat">8</p>
                  <p className="card-subtext">Flagged for Suspicious Activity</p>
                </div>
                <div className="career-card card-accepted">
                  <h4>Internships Posted</h4>
                  <p className="card-stat">35</p>
                  <p className="card-subtext">Live on Portal</p>
                </div>
                <div className="career-card card-rejected">
                  <h4>Applications Reviewed</h4>
                  <p className="card-stat">128</p>
                  <p className="card-subtext">Processed This Month</p>
                </div>
              </div>

              {/* ✅ Alerts */}
              <div className="career-alerts-row">
                <div className="career-alerts-animation">
                  <Lottie
                    animationData={pointerAnimation}
                    loop={true}
                    style={{ width: '100px', height: '100px' }}
                  />
                </div>
                <div className="career-alerts-card">
                  <div className="career-alerts-header">
                    <h3>Alerts</h3>
                    <span className="badge">2</span>
                  </div>
                  <ul className="career-alerts-list">
                    <li><strong>!</strong> New organization pending verification</li>
                    <li><strong>!</strong> A student reported an expired internship</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* ✅ Dynamically rendered pages like Analytics/Profile/Verify */}
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default UniLayout;
