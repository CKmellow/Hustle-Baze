import React, { useState } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" id="navbar-logo">
          Hustle<span>Base</span>
        </Link>

        <div className="navbar-toggle" id="mobile-menu" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/home" className="navbar-links" onClick={toggleMenu}>Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/internships" className="navbar-links" onClick={toggleMenu}>Explore</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-links" onClick={toggleMenu}>Contacts</Link>
          </li>
          <li className="navbar-button">
            <Link to="/login" className="button" onClick={toggleMenu}>Sign in</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
