// your-firebase-config.js

import { initializeApp } from 'firebase/app';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0wCSi8-NJqe35jT2_ZFhQ05vrbImr-Eo",
  authDomain: "nikitha-38246.firebaseapp.com",
  databaseURL: "https://nikitha-38246-default-rtdb.firebaseio.com",
  projectId: "nikitha-38246",
  storageBucket: "nikitha-38246.appspot.com",
  messagingSenderId: "101849405100",
  appId: "1:101849405100:web:e571ee711db852cf137109",
  measurementId: "G-QFPXYZ1X94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
