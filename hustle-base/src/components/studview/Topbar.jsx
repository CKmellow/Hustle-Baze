import React, { useState, useEffect } from 'react';
import { FaBell, FaCommentDots, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

const Topbar = ({ setActivePage, toggleSidebar, sidebarCollapsed }) => {
  const [fname, setFname] = useState('');
  const [email, setEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFname(user.fname);
      setEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
      navigate('/home'); 
    
  };

  const goToProfile = () => {
  if (typeof setActivePage === 'function') {
    setActivePage('profile'); // for legacy dashboards using internal tab switch
  } else {
    navigate('/profile'); // for routers like CareerOfficerProfile
  }
};

  return (
    <header className="topbar">
      <a href="/home" className="logo">Hustle Base</a>

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
          <div
            className="profile-dropdown-trigger"
            onClick={goToProfile}
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            aria-label="User Profile"
          >
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
                onClick={goToProfile}
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
