import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBT0fmU3xwxm-PDCNgncZiZJj1qJdjuiJU",
  authDomain: "planilla-9d5be.firebaseapp.com",
  projectId: "planilla-9d5be",
  storageBucket: "planilla-9d5be.appspot.com",
  messagingSenderId: "466808937834",
  appId: "1:466808937834:web:d3cf70ce6328a52ae79913"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()
const Timestamp = firebase.firestore.Timestamp;

export { firebase, Timestamp, db, auth }
