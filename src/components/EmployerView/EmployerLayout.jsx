import React, { useState, useEffect } from 'react';
import EmployerSidebar from './EmployerSidebar';
import EmployerDash from './EmployerDash';
import Topbar from '../studview/Topbar';
import EmployerProfile from './EmployerProfile';
import './EmployerLayout.css';
import EmployerInternships from './EmployerInternships';
import EmployerApplicationsPage from './EmployerApplicationsPage';

const EmployerLayout = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleAppPage = () => {
      setActivePage("applications");
    };
    window.addEventListener("openApplicationsPage", handleAppPage);
    return () => window.removeEventListener("openApplicationsPage", handleAppPage);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <EmployerDash setActivePage={setActivePage} />;
      case "Internships":
        return <EmployerInternships setActivePage={setActivePage} />;
      case "Profile":
        return <EmployerProfile setActivePage={setActivePage} />;
      case "applications":
        return <EmployerApplicationsPage setActivePage={setActivePage} />;
      case "Logout":
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return <div>Logging out...</div>;
      default:
        return <EmployerDash setActivePage={setActivePage} />;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`employer-app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Topbar 
        setActivePage={setActivePage} 
        toggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="employer-layout">
        <EmployerSidebar 
          setActivePage={setActivePage} 
          activePage={activePage}
          collapsed={sidebarCollapsed}
        />

        <main className="employer-main">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default EmployerLayout;
