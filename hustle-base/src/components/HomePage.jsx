import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import  './LandingPage.css';
import Lottie from 'lottie-react';
import heroAnimation from './animations/student.json';
import buttonAnimation from './animations/button.json';
import { toast } from 'sonner';
import NavBar from './NavBar';
import PostJob from './PostJob';
import AvailableInternships from './AvailableInternships'; // adjust path if needed

import { FaMapMarker, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaTelegram, FaInstagram } from 'react-icons/fa';
const HomePage = () => {
  return (
   <>
       <div className="hero">
  <NavBar />

  <div className="hero-container">
    {/* Left Column: Text */}
    <div className="hero-text">
      <h1 className="hero-heading">Land that <span className="highlighted">dream job</span> without the headache</h1>
      <p className="hero-description">We connect students to real job opportunities with zero stress.
      No fluff, no fuss — just gigs, internships, and career moves that make sense.</p>

      <div className="main-button">
        <button>
          <a href="/login" className="button-link">Subscribe</a>
        </button>
      </div>
    </div>

    {/* Right Column: Animation */}
    <div className="hero-animation">
      <Lottie 
        animationData={heroAnimation} 
        loop={true} 
        style={{ width: '300px', height: '300px', background: 'transparent' }}
      />
    </div>
  </div>
</div>
<AvailableInternships />
  <PostJob />
<section className="testimonials">
  <h2 className="testimonial-heading">What Students Are Saying</h2>
  <div className="testimonial-grid">
    <div className="testimonial-card">
      <p className="testimonial-text">"This platform made it so easy to land my first internship. Highly recommend!"</p>
      <p className="testimonial-name">— Sarah K., University of Nairobi</p>
    </div>
    <div className="testimonial-card">
      <p className="testimonial-text">"I found real jobs, not scams. It’s actually helped me grow professionally."</p>
      <p className="testimonial-name">— Brian M., Kenyatta University</p>
    </div>
    <div className="testimonial-card">
      <p className="testimonial-text">"Super easy to use, and the employers actually responded to me!"</p>
      <p className="testimonial-name">— Anita O., Strathmore</p>
    </div>
  </div>
</section>

    <section className="footer" id="contact">
      <div className="box-container">
        
        <div className="box">
          <h1>About</h1>
          <div className="text">
            <p>At HustleBaze, we are all about making job hunting less of a headache.</p>
            <p>We connect students directly with employers offering real opportunities on a central platfrom</p>
            <p>No fluff, just a platform that actually helps you take the next step in your career with confidence.</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="box">
          <h1>Contact info</h1>
          <div className="icons">
            <a href="#"><FaMapMarker size={20} /> 34 street</a>
            <a href="#"><FaPhone size={20} /> +254 000 000 000</a>
            <a href="mailto:xploreinfo2@gmail.com"><FaEnvelope size={20} /> hustlebase@gmail.com</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="box">
          <h1>Quick links</h1>
          <div className="icons">
            <a href="/home">Home</a>
            <a href="#">Dashboard</a>
            <a href="#">Search</a>
            <a href="/registration">Subscribe</a>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="iconic">
        <a href="https://www.facebook.com/"><FaFacebook size={30} /></a>
        <a href="https://x.com/twitt_login?lang=en"><FaTwitter size={30} /></a>
        <a href="https://web.telegram.org/k/"><FaTelegram size={30} /></a>
        <a href="https://www.instagram.com/accounts/login/?hl=en"><FaInstagram size={30} /></a>
      </div>

      {/* Credits */}
      <div className="credits">
       One job at a time &copy; 2024 <span>HustleBase.</span> All rights reserved
      </div>
    </section>
     
    </> 
  );
};

export default HomePage; 