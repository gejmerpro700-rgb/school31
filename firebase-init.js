// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmfLTb2DzCVUQ_fxhU8UhJ_YMTNL1buZw",
  authDomain: "school31-site.firebaseapp.com",
  projectId: "school31-site",
  storageBucket: "school31-site.firebasestorage.app",
  messagingSenderId: "444340853322",
  appId: "1:444340853322:web:bc76b248b3a0df9aa824b3",
  measurementId: "G-HQQKVPKTLT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Делаем Firebase доступным для обычного script.js
window.school31Firebase = {
  app,
  auth,
  provider,
  db,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};

// Сообщаем сайту, что Firebase готов
document.dispatchEvent(new Event("school31:firebase-ready"));