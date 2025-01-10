import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpu4Yx047baaO8mK4Q0eFSYTitVGQa2PA",

  authDomain: "typer-app-85c23.firebaseapp.com",

  projectId: "typer-app-85c23",

  storageBucket: "typer-app-85c23.firebasestorage.app",

  messagingSenderId: "208711237427",

  appId: "1:208711237427:web:cc97529f38c115fcfdc846",

  measurementId: "G-B6RWWN5ZZG",
};

// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, db, provider };
