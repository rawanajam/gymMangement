import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './PrivateSession.css';

const PrivateClass = () => {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
        // Fetch classes from the backend
        axios.get('http://localhost:5000/api/privateClasses')
          .then(response => {
            setSessions(response.data); // Set fetched data to state
          })
          .catch(error => {
            console.error('Error fetching classes:', error);
          });
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
        <div className="private-session-container">
          <h2>Available Private Sessions</h2>
          <ul className="session-list">
            {sessions.length === 0 ? (
              <p>No private sessions available at the moment.</p>
            ) : (
              sessions.map((session) => (
                <li
                  key={session.id}
                  className={`session-item ${session.isBooked ? 'booked' : ''}`}
                >
                  <h3>Coach: {session.coach}</h3>
                  <p>Expertise: {session.expertise}</p>
                  <p>Day: {session.sessionday}</p>
                  <p>Time: {session.time}</p>
                  {session.isBooked ? (
                    <button className="booked-button" disabled>
                      Booked
                    </button>
                  ) : (
                    <button
                      className="book-button"
                      onClick={() => handleBookSession(session.id)}
                    >
                      Book Now
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      );
    };

export default PrivateClass;

