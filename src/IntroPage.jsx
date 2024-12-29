import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './IntroPageStyle.css';
import introPageImage from './introPage2.webp';

const IntroPage = () => {

  const navigate = useNavigate(); // Hook to programmatically navigate

  const goToLoginPage = () => {
    navigate('/design-block'); // Navigate to the Public Classes page
  };

  return (
    <div className="introPage">
      <div>
        <div className="col-lg-10 move-text">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
          Elevate Your Fitness Journey with Our Gym Management Platform
          </h1>
          <p className="lead">
          Whether you're looking to book a public or private class, or seeking personalized diet plans, our platform offers everything you need to stay on track with your fitness goals. From seamless class scheduling to expert coaching and tailored nutrition advice, we provide a user-friendly and efficient solution for all your fitness needs. Get started today and take the first step toward a healthier, stronger you!
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button onClick={goToLoginPage} type="button" className="btn btn-primary btn-lg px-4 me-md-2">
              Get Started
            </button>
          </div>
        </div>
     </div>
     <div className="col-md-6">
          <img 
            src={introPageImage} // Replace with your image URL
            alt="Fitness Journey"
            className="img-fluid rounded"
          />
        </div>
    </div>
  );
};

export default IntroPage;
