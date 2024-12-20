import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';

const AdminCardComponent = () => {
  return (
    <div className="card-container">
      {/* Manage Public Classes Card */}
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Manage Public Classes</h5>
            <p className="card-text">
              Add, edit, or delete public classes. Keep the schedule updated and maintain a variety of classes for all users.
            </p>
            <a href="/admin/manage-public-classes" className="btn btn-primary">
              Manage Public Classes
            </a>
          </div>
        </div>
      </div>
      
      {/* Manage Private Classes Card */}
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Manage Private Classes</h5>
            <p className="card-text">
              Schedule, modify, or cancel private classes. Provide a personalized experience by managing one-on-one sessions.
            </p>
            <a href="/admin/manage-private-classes" className="btn btn-primary">
              Manage Private Classes
            </a>
          </div>
        </div>
      </div>
      
      {/* Manage Diet Plans Card */}
      <div className="col-sm-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Manage Diet Plans</h5>
            <p className="card-text">
              Create and assign diet plans tailored to client needs. Ensure that nutrition plans complement their fitness goals.
            </p>
            <a href="/admin/manage-diet-plans" className="btn btn-primary">
              Manage Diet Plans
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCardComponent;

