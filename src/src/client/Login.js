// Login.js

import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import app from '../your-firebase-config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      // Fetch user data from Realtime Database to check the role
      const user = auth.currentUser;
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.role === 'client') {
          // Redirect to the client dashboard upon successful login
          navigate('/dashboard');
        } else {
          setError('User does not have client privileges.');
          // You may also sign out the user here if you don't want them to remain authenticated.
        }
      });
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  console.log('Rendering Login');

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div id="login-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Login</h2>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="button" onClick={handleLogin}>Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default Login;
