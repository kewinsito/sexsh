// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHMEaDhtxixycfamuEMC64t6Uy1GA5xoo",
  authDomain: "sexshopweb-c934a.firebaseapp.com",
  projectId: "sexshopweb-c934a",
  storageBucket: "sexshopweb-c934a.firebasestorage.app",
  messagingSenderId: "604810062898",
  appId: "1:604810062898:web:f0f41ce212544c5da3a02b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)