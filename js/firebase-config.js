// Firebase Configuration
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

// Enable offline persistence for faster loading
db.enablePersistence({ synchronizeTabs: true })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // Browser doesn't support persistence
      console.log('Persistence not supported by browser');
    }
  });

// Initialize Firebase Authentication (only if firebase.auth is available)
// The customer page doesn't load the auth SDK, only the admin page does
const auth = typeof firebase.auth === 'function' ? firebase.auth() : null;

// Export for use in other files
window.db = db;
if (auth) {
  window.auth = auth;
}
