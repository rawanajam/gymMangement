import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cardStyle.css';
import axios from 'axios';
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

  const handleBookSession = (id) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === id ? { ...session, isBooked: true } : session
      )
    );
    alert('Session booked successfully!');
  };

  return (
    <div className="private-session-container">
      <h2>Available Private Sessions</h2>
      <ul className="session-list">
        {sessions.map((session) => (
          <li key={session.id} className={`session-item ${session.isBooked ? 'booked' : ''}`}>
            <h3>Coach: {session.coach}</h3>
            <p>Expertise: {session.expertise}</p>
            <p>Day: {session.sessionday}</p>
            <p>Time: {session.time}</p>
            {session.isBooked ? (
              <button className="booked-button" disabled>Booked</button>
            ) : (
              <button className="book-button" onClick={() => handleBookSession(session.id)}>
                Book Now
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrivateClass;

