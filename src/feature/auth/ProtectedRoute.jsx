import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;  // Redirige al login si no hay token
  }
  return element;  // Si hay token, renderiza el componente protegido
};

export default ProtectedRoute;
