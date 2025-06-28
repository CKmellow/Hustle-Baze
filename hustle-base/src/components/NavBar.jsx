import React from 'react';
import './NavBar.css'; // Link your CSS here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
          {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /> */}
          <li className="navbar-item">
            <Link to="/home" className="navbar-links">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/internships" className="navbar-links">Explore</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-links">Contacts</Link>
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
