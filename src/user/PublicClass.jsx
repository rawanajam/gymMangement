import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';
import axios from 'axios';

const PublicClass = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Fetch classes from the backend
    axios.get('http://localhost:5000/api/publicClasses')
      .then(response => {
        setClasses(response.data); // Set fetched data to state
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  return (
    <div className="row">
      {classes.map((classItem, index) => (
        <div className="col-sm-4" key={index}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{classItem.title}</h5>
              <p className="card-text">{classItem.description}</p>
              <a href={classItem.link} className="btn btn-success">Book Now</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicClass;

