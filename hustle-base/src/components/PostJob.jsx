import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import  './PostJob.css';
import animationData from './animations/employer.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandshake,
  faRocket,
  faBriefcase,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';


const PostJob = () => {
  const navigate = useNavigate();

  return (
    <div className="post-job-section">
      <div className="text-content">
        <h2>
          <FontAwesomeIcon icon={faHandshake} /> Hello Employer!
        </h2>
        <p>
          <FontAwesomeIcon icon={faRocket} /> Got a great opportunity to share?
          <br />
          <FontAwesomeIcon icon={faBriefcase} /> Our students are ready to contribute, learn, and grow.
          <br />
          Let’s make a career spark happen!
        </p>
        <button className="post-job-btn" onClick={() => navigate('/login')}>
          Post a Job <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className="animation-container">
        <Lottie animationData={animationData} loop autoplay />
      </div>
    </div>
  );
};

export default PostJob;
