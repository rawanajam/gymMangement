// ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  return token ? element : <Navigate to="/" />; // Redirect to login if not authenticated
};

export default ProtectedRoute;
