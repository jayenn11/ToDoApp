import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1u-XnANFhPhzOT-6TACSRbiKris7iK30",
  authDomain: "jayprojects-2af34.firebaseapp.com",
  projectId: "jayprojects-2af34",
  storageBucket: "jayprojects-2af34.firebasestorage.app",
  messagingSenderId: "729862958446",
  appId: "1:729862958446:web:10fc1657374a5cf60f257f",
  measurementId: "G-FY3WV3424G",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
