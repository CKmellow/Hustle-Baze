import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import  './LandingPage.css';
import Lottie from 'lottie-react';
import heroAnimation from './animations/home1.json';
import buttonAnimation from './animations/button.json';
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
          background: `white`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-container">
          <div className='hero-text'>
          <p className="hero-heading">Land that job — without the headache</p>
          <p className="hero-description">We connect students to real job opportunities with zero stress. 
            No fluff, no fuss — just good gigs, internships, and career moves that make sense.</p>
            </div>
          <div className='animation'>
          <Lottie 
            animationData={heroAnimation} 
            loop={true} 
            style={{ width: '450px', height: '450px',background: 'transparent'}}
          />
          </div>
        </div>
        <div className='button-container'>
        <Lottie 
            animationData={buttonAnimation} 
            loop={true} 
            style={{ width: '300px', height: '150px', background: 'transparent' }}
          />
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