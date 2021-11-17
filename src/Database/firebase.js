import  firebase from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDUGGL1H8HGFdi7AywS84QUDOa8TZQzXS4",
  authDomain: "taskmanagment-6fbc3.firebaseapp.com",
  projectId: "taskmanagment-6fbc3",
  storageBucket: "taskmanagment-6fbc3.appspot.com",
  messagingSenderId: "255398935",
  appId: "1:255398935:web:d8e669eb8bc7fd49077852",
  measurementId: "G-13F4N4WK9T"
};
if (!firebase.apps.length) {
  
  firebase.initializeApp(firebaseConfig);
}


export default firebase;