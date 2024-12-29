// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch role from localStorage or API
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newRole) => {
    setRole(newRole);
    setIsAuthenticated(true);
    localStorage.setItem('role', newRole);
  };

  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
