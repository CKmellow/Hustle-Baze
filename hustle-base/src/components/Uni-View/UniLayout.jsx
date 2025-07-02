import React, { useState, useEffect } from 'react';
import ViewAnalytics from './ViewAnalytics';
import CareerOfficerProfile from './CareerOfficerProfile';
import VerifyOrganizations from './VerifyOrganizations';
import Lottie from 'lottie-react';
import pointerAnimation from '../animations/Alert.json';
import Topbar from '../studview/Topbar';
import { Home, Users, BarChart2, LogOut, UserCircle } from 'lucide-react';
import './UniLayout.css';
import { useNavigate } from 'react-router-dom';

const UniLayout = () => {
  const [user, setUser] = useState({ fname: '', lname: '' });
  const [activePage, setActivePage] = useState("dashboard");
  const [cardStats, setCardStats] = useState({
    verifiedOrgs: 0,
    rejectedOrgs: 0,
    internships: 0,
    applications: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard-stats')
;
        const data = await response.json();
        setCardStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);
const [alerts, setAlerts] = useState([]);

useEffect(() => {
  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  fetchAlerts();
}, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return null;
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
      <Topbar setActivePage={setActivePage} />

      <div className="career-dashboard">
        <aside className="sidebars">
          <h2>Career Portal</h2>
          <nav>
            <ul>
              <li className={activePage === "dashboard" ? "active" : ""}>
                <a onClick={() => setActivePage("dashboard")}><Home size={18} /> Dashboard</a>
              </li>
              <li className={activePage === "profile" ? "active" : ""}>
                <a onClick={() => setActivePage("profile")}><UserCircle size={18} /> My Profile</a>
              </li>
              <li className={activePage === "verify" ? "active" : ""}>
                <a onClick={() => setActivePage("verify")}><Users size={18} /> Verify Organizations</a>
              </li>
              <li className={activePage === "analytics" ? "active" : ""}>
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
              <div className="career-cards-grid">
                <div
                  className="career-card card-pending"
                  onClick={() => setActivePage("verify")}
                  style={{ cursor: "pointer" }}
                >
                  <h4>Organizations Verified</h4>
                  <p className="card-stat">{cardStats.verifiedOrgs}</p>
                  <p className="card-subtext">Successfully Approved</p>
                </div>
                <div
                  className="career-card card-rejected"
                  onClick={() => setActivePage("verify")}
                  style={{ cursor: "pointer" }}
                >
                  <h4>Organizations Rejected</h4>
                  <p className="card-stat">{cardStats.rejectedOrgs}</p>
                  <p className="card-subtext">Flagged for Suspicious Activity</p>
                </div>
                <div className="career-card card-accepted">
                  <h4>Internships Posted</h4>
                  <p className="card-stat">{cardStats.internships}</p>
                  <p className="card-subtext">Live on Portal</p>
                </div>
                <div
                  className="career-card card-rejected"
                  onClick={() => setActivePage("analytics")}
                  style={{ cursor: "pointer" }}
                >
                  <h4>Applications Reviewed</h4>
                  <p className="card-stat">{cardStats.applications}</p>
                  <p className="card-subtext">Processed This Month</p>
                </div>
              </div>

              <div className="career-alerts-row">
                <div className="career-alerts-animation">
                  <Lottie
                    animationData={pointerAnimation}
                    loop
                    style={{ width: '100px', height: '100px' }}
                  />
                </div>
                <div className="career-alerts-card">
                  <div className="career-alerts-header">
                    <h3>Alerts</h3>
                    <span className="badge">2</span>
                  </div>
 <ul className="career-alerts-list">
  {alerts.length > 0 ? (
    alerts.map((alert, index) => (
      <li key={index} className="alert-item fade-in">
        <div className="alert-icon">⚠</div>
        <div className="alert-content">
          <span className="alert-title">New Organization</span>
          <p className="alert-message">{alert.message}</p>
        </div>
      </li>
    ))
  ) : (
    <li className="no-alerts">🎉 No new alerts at the moment!</li>
  )}
</ul>


                </div>
              </div>
            </section>
          )}

          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default UniLayout;
