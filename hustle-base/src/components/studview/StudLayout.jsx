import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import StudentDash from './StudentDash';
import './StudentLayout.css';
import Topbar from './Topbar';
import Applications from './Applications';
import Internships from './Internships';
import ApplicationForm from './ApplicationForm';

const StudentLayout = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <StudentDash />;
      case "Applications":
        return <Applications setActivePage={setActivePage} />;
      case "Internships":
        return <Internships setActivePage={setActivePage}/> ;
      case "ApplicationForm":
        return <ApplicationForm setActivePage={setActivePage} />;
      case "reports":
        return <div>Progress Reports Page</div>;
      case "messages":
        return <div>Messages Page</div>;
      case "resources":
        return <div>Resources Page</div>;
      case "help":
        return <div>Help Page</div>;
      case "settings":
        return <div>Settings Page</div>;
      case "logout":
        return <div>Logging out...</div>;
      default:
        return <div>Page Not Found</div>;
    }
  };

  return (
    <div>
        <Topbar />
            <div className="student-layout">
            <StudentSidebar setActivePage={setActivePage} />
            <main className="student-main">
                {renderPage()}
            </main>
            </div>
    </div>
  );
};

export default StudentLayout;
