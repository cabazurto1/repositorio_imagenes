// client/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import '../App.css'; // Importar el CSS general

const ProtectedRoute = ({ children }) => {
  // const adminToken = localStorage.getItem('adminToken'); // Descomenta si implementas autenticación

  // Temporalmente permitir el acceso sin verificar el token
  const isAuthenticated = true; // Cambia esto a la lógica de autenticación cuando implementes tokens

  /* 
  Si implementas la autenticación, usa lo siguiente:
  
  if (!adminToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
  */

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
