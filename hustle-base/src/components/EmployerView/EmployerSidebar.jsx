import React from 'react';
import './EmployerSidebar.css'; // ← import the stylesheet
import { 
  FaHome, FaClipboardList, FaBriefcase, FaFileAlt, 
  FaEnvelope, FaBook, FaQuestionCircle, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

const EmployerSidebar = ({ setActivePage }) => {
   const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };
  const links = [
    { key: 'Dashboard', label: 'Dashboard', icon: <FaHome /> },
    { key: 'Applications', label: 'My Applications', icon: <FaClipboardList /> },
    { key: 'Internships', label: 'Internships', icon: <FaBriefcase /> },
    // { key: 'reports', label: 'Progress Reports', icon: <FaFileAlt /> },
    // { key: 'messages', label: 'Messages', icon: <FaEnvelope /> },
    // { key: 'resources', label: 'Resources', icon: <FaBook /> },
    // { key: 'help', label: 'Help', icon: <FaQuestionCircle /> },
    // { key: 'settings', label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="sidebar">
      <div>
        <h1>EmployerPortal</h1>
        <ul>
          {links.map(({ key, label, icon }) => (
            <li key={key} onClick={() => setActivePage(key)}>
              <span>{icon}</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          <li onClick={handleLogout} className="logout">
            <FaSignOutAlt />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmployerSidebar;
