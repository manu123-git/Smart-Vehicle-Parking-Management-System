// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Login from './client/Login';
import Dashboard from './client/Dashboard';
import Signup from './client/Signup';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import PrivateRoute from './PrivateRoute';
import Home1 from './Home-client';
import Home2 from './Home-admin';
import Home from './Home';


const App = () => {
  const auth = getAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home-admin" element={<Home2 />} />
        <Route path="/Home-client" element={<Home1 />} />
        <Route path="/login" element={<Login />} />
    
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute
              element={<AdminDashboard />}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={<Dashboard auth={auth} />}
            />
          }
        />
        {/* Add more routes for your application */}
      </Routes>
    </Router>
  );
};

export default App;
