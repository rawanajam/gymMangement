import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DesignBlock from './DesignBlock';
import IntroPage from './IntroPage';
import UserCardComponent from './user/UserCardComponent';
import ProtectedRoute from './ProtectedRoute';
import PublicClass from './user/PublicClass';
import PrivateClass from './user/PrivateClass';
import DietClass from './user/DietClass';
import AdminCardComponent from './admin/AdminCardComponent';
import ManageDietPlan from './admin/ManageDietPlan';
import ManagePrivateClass from './admin/ManagePrivateClass';
import ManagePublicClass from './admin/ManagePublicClass';

function App() {
  
  //const role = localStorage.getItem('role'); // Get role from local storage
  //console.log("role: " + role);
  const [role, setRole] = useState(null); // Initial role is null

  useEffect(() => {
    // Simulate fetching role from localStorage after login
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        if(role===null){
        <Route path="/design-block" element={<DesignBlock />} />
        }

        {/* Protected Routes for Logged-in Users */}


        <Route path="/sign-up-result" element={<ProtectedRoute element={<UserCardComponent />} />} />

      

        {/* Conditional Routes based on Role */}
          {role === 'admin' && (
          <>
            <Route path="/admin" element={<AdminCardComponent />} />
            <Route path="/admin/manage-public-classes" element={<ProtectedRoute element={<ManagePublicClass />} />} />
            <Route path="/admin/manage-private-classes" element={<ProtectedRoute element={<ManagePrivateClass />} />} />
            <Route path="/admin/manage-diet-plans" element={<ProtectedRoute element={<ManageDietPlan />} />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </> )}
          {role === 'postgres' && (
          <>
            <Route path="/user" element={<UserCardComponent />} />   
            <Route path="/user/public-class" element={<PublicClass />} />
            <Route path="/user/private-class" element={<PrivateClass />} />
            <Route path="/user/diet-plan" element={<DietClass />} /> 
            <Route path="*" element={<Navigate to="/user" />} />
          </>
          )}
          {role !== 'admin' && role !== 'user' && <Route path="*" element={<Navigate to="/design-block" />} />}
      </Routes>
    </Router>
  );
}

export default App;



