// ===================================
// FIREBASE CONFIGURATION
// ===================================

// SECURITY NOTE: Firebase web API keys are designed to be public and included in client-side code.
// They identify your Firebase project to Google servers. Security is enforced through:
// - Firestore Security Rules
// - Firebase Authentication
// - Firebase App Check (recommended for production)
// For more info: https://firebase.google.com/docs/projects/api-keys

const firebaseConfig = {
    apiKey: "AIzaSyCippFOtLGMzOCSh8IFgqJY6R6KT7pRNXc",
    authDomain: "baby-bloom-cms.firebaseapp.com",
    projectId: "baby-bloom-cms",
    storageBucket: "baby-bloom-cms.firebasestorage.app",
    messagingSenderId: "171708002177",
    appId: "1:171708002177:web:05d7b6c85dc5333e898280",
    measurementId: "G-H3G4GV3W0L"
};

// Initialize Firebase
let app, auth, db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log('✅ Firebase initialized successfully!');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
    alert('Firebase configuration error. Please check firebase-config.js and ensure you\'ve added your Firebase credentials.');
}

// Export for use in other scripts
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;
