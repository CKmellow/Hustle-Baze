import React, { useState, useEffect } from 'react';
import { FaBell, FaCommentDots, FaUserCircle } from 'react-icons/fa';
import './Topbar.css';

const Topbar = () => {
const [fname, setFname] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.fname) {
      setFname(user.fname);
    }
  }, []);

  return (
    <header className="topbar">
      <div className="logo">Hustle Base</div>

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
          <span className="username">{fname} ▼</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
