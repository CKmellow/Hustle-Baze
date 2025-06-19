import React, { useState, useEffect } from 'react';
import ViewAnalytics from './ViewAnalytics'; 
import AnalyticsLayout from './AnalyticsLayout';
import { Home, Users, BarChart2, LogOut, UserCircle, Bell, ArrowLeft } from 'lucide-react';

import './UniLayout.css';
import { useNavigate } from 'react-router-dom';


const UniLayout = () => {
     const [user, setUser] = useState({ fname: '', lname:'' });
     const navigate = useNavigate();


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

    const [activePage, setActivePage] = useState("dashboard");

    const renderPage = () => {
  switch (activePage) {
    case "dashboard":
      return;
          case "analytics":
      return <ViewAnalytics />;
    default:
      return <p>Page not found.</p>;
  }
};
 return (
    <div className="career-dashboard">
      <aside className="sidebar">
        <h2>Career Portal</h2>
        <nav>
          <ul>
            <li>
              <a href="#" onClick={() => setActivePage("dashboard")}><Home size={18} /> Dashboard</a>
            </li>
            <li>
              <a href="#"  onClick={(e) => {
                  e.preventDefault();
                  window.open('/verify-organizations', '_blank');
                }}><Users size={18} /> Verify Organizations</a>
            </li>
            <li>
              <a href="#"  onClick={(e) => {
              e.preventDefault();
              window.open('/analytics-dashboard', '_blank');
            }}
  ><BarChart2 size={18} /> Internship Analytics</a>
            </li>
            <li>
              <a href="#" onClick={() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
      }}><LogOut size={18} /> Logout</a>
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
            <Bell size={22} />
            <UserCircle size={24} />
            <span className="officer-name">{user?.fname}</span>
          </div>
        </header>
        <h1>Welcome, {user?.fname} {user?.lname}!</h1>
        <section className="dashboard-widgets">
          <p>Select an option from the sidebar to begin managing your dashboard.</p>
        </section>
        {renderPage()}
      </main>
    </div>
  );
};

export default UniLayout;
