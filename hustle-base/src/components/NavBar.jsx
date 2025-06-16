import React from 'react';
import './NavBar.css'; // Link your CSS here
import { Link } from 'react-router-dom'; // If you're using React Router

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" id="navbar-logo">
          Hustle<span>Base</span>
        </Link>

        <div className="navbar-toggle" id="mobile-menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/LandingPage" className="navbar-links">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/activities" className="navbar-links">Explore</Link>
          </li>
          <li className="navbar-item">
            <Link to="/hiddenGems" className="navbar-links">Contact us</Link>
          </li>
          <li className="navbar-button">
            <Link to="/login" className="button">Sign in</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
