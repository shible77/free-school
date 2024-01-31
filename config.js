import firebase  from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB_-lQl1Tx0SIIhp1XInbcCqq9_tW2u2vo",
    authDomain: "online-tl-platform.firebaseapp.com",
    databaseURL: "https://online-tl-platform-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "online-tl-platform",
    storageBucket: "online-tl-platform.appspot.com",
    messagingSenderId: "457347239166",
    appId: "1:457347239166:web:676d074bf01435bced69af"
};

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}

export {firebase};