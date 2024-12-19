import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';
import {jwtDecode} from 'jwt-decode';
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

  const handleBookClass = async (id) => {
    try {
      // Decode user info from token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to book a session!');
        return;
      }
      const decodedToken = jwtDecode(token);
      const fullname = decodedToken.fullname;

      // Make the booking API request
       const response = await axios.post(
        'http://localhost:5000/api/bookClass',
        { fullname, id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.success) {
        alert('Class booked successfully!');
        // Optionally, update the frontend state with the new class data
        setClasses((prevClasses) =>
          prevClasses.map((classItem) =>
            classItem.id === id ? { ...classItem} : classItem
          )
        );
      } else {
        alert('Failed to book the class. Please try again.');
      }
    } catch (error) {
      console.error('Error booking class:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="card-container">
      <nav className="navbar navbar-light fixed-top">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1">Available Public Classes</span>
            </div>
           </nav>
      {classes.map((classItem, index) => (
        <div className="col-sm-4" key={index}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{classItem.title}</h5>
              <p className="card-text">{classItem.description}</p>
              <button className="btn btn-primary" onClick={() => handleBookClass(classItem.id)}>Book Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicClass;

