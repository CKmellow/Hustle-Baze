import React from 'react';
import { FaBell, FaCommentDots, FaUserCircle } from 'react-icons/fa';
import './Topbar.css';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="logo">InternPortal</div>

      {/* Search bar removed */}

      <div className="topbar-icons">
        <button className="icon-button" aria-label="Notifications">
          <FaBell />
          <span className="badge">3</span>
        </button>
        <button className="icon-button" aria-label="Messages">
          <FaCommentDots />
          <span className="badge">5</span>
        </button>
        <div className="profile-dropdown" tabIndex={0} aria-label="User Profile">
          <FaUserCircle className="profile-icon" />
          <span className="username">John ▼</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
