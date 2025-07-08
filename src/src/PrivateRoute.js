// PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const PrivateRoute = ({ element }) => {
  const auth = getAuth();
  const isAuthenticated = auth.currentUser !== null;

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
