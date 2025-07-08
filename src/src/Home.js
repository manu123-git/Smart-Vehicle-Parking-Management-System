// Home.js

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Welcome to the Home Page</h2>
      <div>
        <Link to="/Home-admin">ADMIN</Link>
      </div>
      <div>
        <Link to="/Home-client">CLIENT</Link>
      </div>
    </div>
  );
};

export default Home;
