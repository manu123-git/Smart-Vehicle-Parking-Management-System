// AdminSignup.js

import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import app from '../your-firebase-config';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminSignup = async () => {
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Access the user object from the userCredential
      const user = userCredential.user;

      // Store user details in the Realtime Database with an "admin" role under the "admin1" path
      const db = getDatabase(app);
      const adminRef = ref(db, `admin/${user.uid}`);
      await set(adminRef, {
        email: user.email,
        userId: user.uid,
        role: 'admin',
        // Add more user details as needed
      });

      // Alert for successful admin signup
      alert('Admin Signup successful!');

      // Clear input fields
      setEmail('');
      setPassword('');

    } catch (error) {
      setError('Error creating admin account. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div id="admin-signup-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Admin Signup</h2>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="button" onClick={handleAdminSignup}>Signup as Admin</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default AdminSignup;
