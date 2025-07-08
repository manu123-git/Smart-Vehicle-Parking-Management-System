// Signup.js

import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import app from '../your-firebase-config';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Access the user object from the userCredential
      const user = userCredential.user;

      // Store user details in the Realtime Database with a default role
      const db = getDatabase(app);
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        name: name, // Add the name field
        email: user.email,
        userId: user.uid,
        role: 'client', // Default role
        // Add more user details as needed
      });

      // Alert for successful signup
      alert('Signup successful!');

      // Clear input fields
      setName('');
      setEmail('');
      setPassword('');

    } catch (error) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div id="signup-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Signup</h2>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="button" onClick={handleSignup}>Signup</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default Signup;
