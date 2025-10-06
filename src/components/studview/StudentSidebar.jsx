import React from 'react';
import './StudentSidebar.css'; // ← import the stylesheet
import { 
  FaHome, FaClipboardList, FaBriefcase, FaFileAlt, 
  FaEnvelope, FaBook, FaQuestionCircle, FaCog, FaSignOutAlt, FaMagic 
} from 'react-icons/fa';

const StudentSidebar = ({ setActivePage }) => {
   const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };
  const links = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { key: 'Applications', label: 'My Applications', icon: <FaClipboardList /> },
    { key: 'Internships', label: 'Internships', icon: <FaBriefcase /> },
    { key: 'Comments', label: 'Rate us', icon: <FaFileAlt /> },
    { key: 'Enhancer', label: 'CV Enhancer', icon: <FaMagic /> },    
    // { key: 'reports', label: 'Progress Reports', icon: <FaFileAlt /> },
    // { key: 'messages', label: 'Messages', icon: <FaEnvelope /> },
    // { key: 'resources', label: 'Resources', icon: <FaBook /> },
    // { key: 'help', label: 'Help', icon: <FaQuestionCircle /> },
    // { key: 'settings', label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="sidebar">
      <div>
        <h1>InternPortal</h1>
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

export default StudentSidebar;
