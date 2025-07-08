// Home.js

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Welcome to the Home Page</h2>
      <div>
        <Link to="/admin-login">Login</Link>
      </div>
      <div>
        <Link to="/admin-signup">Signup</Link>
      </div>
    </div>
  );
};

export default Home;
