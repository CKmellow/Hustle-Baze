import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import  './LandingPage.css';
import { toast } from 'sonner';
import NavBar from './NavBar';
const LandingPage = () => {
  return (
    <>
      <NavBar />
    <div className="hero">
      <div
        className="box"
        style={{
          background: `linear-gradient(to right, #1c92d2, #f2fcfe)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-container">
          <h3 className="hero-heading">wiiiiiiiiijoiflmkfcl;k</h3>
          <p className="hero-description">Real, Actual, Everyday life</p>

          <div className="main-button">
            <button>
              <a href="/login" className="button-link">Subscribe</a>
            </button>
          </div>
        </div>
      </div>
    </div>
     </>
  );
};

export default LandingPage; ;