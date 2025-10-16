// Firebase Configuration Template
// Copy this file to firebase-config.js and replace with your actual Firebase credentials
// Get these from Firebase Console > Project Settings > General > Your apps > Web app

const firebaseConfig = {
  apiKey: "AIzaSyBJw4A-KJetG_qtYX9TxezYgjXpo44oWzQ",
  authDomain: "waitlist-manager-wong.firebaseapp.com",
  projectId: "waitlist-manager-wong",
  storageBucket: "waitlist-manager-wong.firebasestorage.app",
  messagingSenderId: "331452243719",
  appId: "1:331452243719:web:c06ad02ad93d6b20296fa2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export for use in other files
window.db = db;
