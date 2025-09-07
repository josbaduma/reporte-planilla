import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBT0fmU3xwxm-PDCNgncZiZJj1qJdjuiJU",
  authDomain: "planilla-9d5be.firebaseapp.com",
  projectId: "planilla-9d5be",
  storageBucket: "planilla-9d5be.appspot.com",
  messagingSenderId: "466808937834",
  appId: "1:466808937834:web:d3cf70ce6328a52ae79913",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, Timestamp };
