import firebase from 'firebase'  
  
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAl9PM5IM8Thr0A6ggBrON4PzWgGDAkZCs",
    authDomain: "react-firebase-bcdd1.firebaseapp.com",
    projectId: "react-firebase-bcdd1",
    storageBucket: "react-firebase-bcdd1.appspot.com",
    messagingSenderId: "867736567305",
    appId: "1:867736567305:web:b772d51b1b5daa24d8c2d8",
    measurementId: "G-NWJHBS1BX9"
  };

  var fire = firebase.initializeApp(firebaseConfig);
  export default fire;