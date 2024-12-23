import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';
import publicClassImage from './publicClass.webp';
import privatClassImage from './privateClass.webp';

const CardComponent = () => {
  return (
    <div className="row">
      {/* Public Class Card */}
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
          <img src={publicClassImage} alt="public class" className='imgCard'/>
            <h5 className="card-title">Take a Public Class</h5>
            <p className="card-text">
              Join group sessions led by professional trainers. Perfect for those who enjoy a motivating, social workout atmosphere.
            </p>
            <a href="/user/public-class" className="btn btn-primary">
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      {/* Private Class Card */}
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
            <img src={privatClassImage} alt="private class" className='imgCard'/>
            <h5 className="card-title">Book a Private Class</h5>
            <p className="card-text">
              Get personalized coaching tailored to your goals. Perfect for focused, one-on-one training sessions.
            </p>
            <a href="/user/private-class" className="btn btn-primary">
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      {/* Diet Plan Card */}
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Get a Diet Plan</h5>
            <p className="card-text">
              Receive a customized nutrition plan to complement your workouts and help you achieve your fitness goals.
            </p>
            <a href="/user/diet-plan" className="btn btn-primary">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
