import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';

const CardComponent = () => {
  return (
    <div className="row">
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Take Public Classes</h5>
            <p className="card-text">
              Join group sesssions led by professional trainers. Perfect for those who enjoy a motivating, social workout atmosphere.
            </p>
            <a href="/user/public-class" className="btn btn-primary">
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Private Classes</h5>
            <p className="card-text">
              Get personalized coaching tailored to your goals. Perfect for focused, one-on-one training sessions.
            </p>
            <a href="/user/private-class" className="btn btn-primary">
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Diet Plan</h5>
            <p className="card-text">
              Receive a customized nutrition plan to complement your workouts and help you acheive your fitness goals.
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

