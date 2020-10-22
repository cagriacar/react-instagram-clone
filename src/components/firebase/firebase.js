import firebase from "firebase";

/* Firebase Bağlantısı */

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC1v5wLHWms9r_xNgLpcU5E0EOxfkv7-0g",
  authDomain: "instagram-clone-react-64ae4.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-64ae4.firebaseio.com",
  projectId: "instagram-clone-react-64ae4",
  storageBucket: "instagram-clone-react-64ae4.appspot.com",
  messagingSenderId: "93157273866",
  appId: "1:93157273866:web:149a64707a3bba5b170af3",
  measurementId: "G-0CHEN6KD4Q"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export  { db, auth, storage };
