import React, { useState, useEffect } from 'react';
import { FaBell, FaCommentDots, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Topbar.css';

const Topbar = ({ setActivePage, toggleSidebar, sidebarCollapsed }) => {
  const [fname, setFname] = useState('');
  const [email, setEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFname(user.fname);
      setEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActivePage('Login');
  };

  return (
    <header className="topbar">
     
      <div className="logo">Hustle Base</div>

      <div className="topbar-icons">
        <button className="icon-button" aria-label="Notifications">
          <FaBell />
          <span className="badge">3</span>
        </button>
        <button className="icon-button" aria-label="Messages">
          <FaCommentDots />
          <span className="badge">5</span>
        </button>
        <div 
          className="profile-dropdown-container"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="profile-dropdown-trigger" tabIndex={0} aria-label="User Profile">
            <FaUserCircle className="profile-icon" />
            <span className="username">{fname} ▼</span>
          </div>
          
          {showDropdown && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-email">{email}</div>
              <div className="dropdown-profile-icon">
                <FaUserCircle size={24} />
              </div>
              <div className="dropdown-name">{fname}</div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item"
                onClick={() => setActivePage('Profile')}
              >
                Profile
              </button>
              <button 
                className="dropdown-item"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;