// AdminLogin.js

import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import app from '../your-firebase-config'; // Make sure to import your Firebase configuration

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      // Fetch user data from Realtime Database to check the role
      const user = auth.currentUser;
      const db = getDatabase();
      const userRef = ref(db, `admin/${user.uid}`);

      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.role === 'admin') {
          // Redirect to the admin dashboard upon successful login
          navigate('/admin-dashboard');
        } else {
          setError('User does not have admin privileges.');
          // You may also sign out the user here if you don't want them to remain authenticated.
        }
      });
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div id="admin-login-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Admin Login</h2>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="button" onClick={handleAdminLogin}>Login as Admin</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default AdminLogin;
