import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import StudentDash from './StudentDash';
import './StudentLayout.css';
import Topbar from './Topbar';
import Applications from './Applications';
import Internships from './Internships';
import ApplicationForm from './ApplicationForm';
import StudentProfile from './StudentProfile'; 
import StudentComments from './StudentComments';

const StudentLayout = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <StudentDash setActivePage={setActivePage} />;
      case "Applications":
        return <Applications setActivePage={setActivePage} />;
      case "Internships":
        return <Internships setActivePage={setActivePage} />;
      case "ApplicationForm":
        return <ApplicationForm setActivePage={setActivePage} />;
      case "Profile":
        return <StudentProfile setActivePage={setActivePage} />;
      case "Comments":
        return <StudentComments setActivePage={setActivePage} />;
      // case "Reports":
      //   return <div>Progress Reports Page</div>;
      // case "Messages":
      //   return <div>Messages Page</div>;
      // case "Resources":
      //   return <div>Resources Page</div>;
      // case "Help":
      //   return <div>Help Page</div>;
      // case "Settings":
      //   return <div>Settings Page</div>;
      case "Logout":
        // Handle logout logic here
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return <div>Logging out...</div>;
      default:
        return <StudentDash setActivePage={setActivePage} />;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`student-app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Topbar 
        setActivePage={setActivePage} 
        toggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="student-layout">
        <StudentSidebar 
          setActivePage={setActivePage} 
          activePage={activePage}
          collapsed={sidebarCollapsed}
        />
        
        <main className="student-main">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;