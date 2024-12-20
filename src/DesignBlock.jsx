import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {jwtDecode}from 'jwt-decode';
function DesignBlock() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize navigate
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage(''); // Clear message when toggling forms
    setEmail(''); // Optional: Clear email on toggle
    setFullname('');
    setPassword(''); // Optional: Clear password on toggle
    setConfirmPassword(''); // Optional: Clear confirm password on toggle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
        if (isLogin) {
          const response = await axios.post('http://localhost:5000/api/login', {
            email,
            password,
          });
          const token = response.data.token;
          localStorage.setItem('token', token);
  
          // Decode the token to get the role
          const decodedToken = jwtDecode(token);
          localStorage.setItem('role', decodedToken.role);
          
          const userRole = decodedToken.role;

        localStorage.setItem('role', userRole); // Store the role in localStorage
        console.log("role: " + userRole);
        // Navigate based on role
        if (userRole === 'admin') {
          navigate('/admin'); // Redirect to admin dashboard
        } else if (userRole === 'postgres') {
          navigate('/user'); // Redirect to user dashboard
        } else {
          setMessage('Invalid user role. Please contact support.');
        }

      } else {
        // Handle Sign Up
        if (password !== confirmPassword) {
          setMessage('Passwords do not match.');
          return;
        }
        const response = await axios.post('http://localhost:5000/api/register', {
          email,
          fullname,
          password,
        });
        const token = response.data.token;
    if (token) {
      localStorage.setItem('token', token); // Store the new token if sent
    }
        setMessage('Registration successful!');
        navigate('/sign-up-result');
      }
    } catch (error) {
      setMessage('Error occurred: ' + error.response.data.error);
    }
  };

  return (
    <div className="App" >
      <div className="container d-flex justify-content-center align-items-center min-vh-100" >
        <div className="card-login shadow-lg p-3 mb-5 bg-white rounded" style={{ width: '400px' }}>
          <div className="card-body">
            <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>

            {message && <div className="alert alert-warning">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="email">{isLogin ? 'Email address' : 'Enter your email'}</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              {!isLogin && (
                <div className="form-group mb-3">
                  <label htmlFor="Fullname">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="form-group mb-3">
                <label htmlFor="password">{isLogin ? 'Password' : 'Create a password'}</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                />
              </div>

              {!isLogin && (
                <div className="form-group mb-3">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block w-100">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>

              <div className="text-center mt-3">
                <a href="#!" onClick={toggleForm} className="text-secondary">
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignBlock;
