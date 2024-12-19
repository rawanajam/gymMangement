import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const PrivateClass = () => {
  const [sessions, setSessions] = useState([]);
  
  // Fetch private sessions from the API
  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/privateClassesUser');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  useEffect(() => {
    // Fetch sessions when the component mounts
    fetchSessions();
  }, []);

  const handleBookSession = async (id) => {
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
        'http://localhost:5000/api/bookSession',
        { fullname, id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle successful booking
      if (response.data && response.data.success) {
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === id ? { ...session, isBooked: true } : session
          )
        );
        alert('Session booked successfully!');
      } else {
        alert('Failed to book session. Please try again.');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      alert('An error occurred while booking the session. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-light fixed-top">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1">Available Private Sessions</span>
            </div>
           </nav>
      <div className="card-container">
        {sessions.length === 0 ? (
          <p>No private sessions available at the moment.</p>
        ) : (
          sessions.map((session) => (
            <div className="col-sm-4 mb-4" key={session.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Coach: {session.coach}</h5>
                  <p className="card-text">Expertise: {session.expertise}</p>
                  <p className="card-text">Day: {session.sessionday}</p>
                  <p className="card-text">Time: {session.time}</p>
                  {session.isBooked ? (
                    <button className="btn btn-secondary" disabled>
                      Booked
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleBookSession(session.id)}
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrivateClass;
