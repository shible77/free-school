import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDz9IEzRYSBCt_qdA5Dfv3NvTSmFdh9w4E",
    authDomain: "mymobileapp-85398.firebaseapp.com",
    projectId: "mymobileapp-85398",
    storageBucket: "mymobileapp-85398.appspot.com",
    messagingSenderId: "614551187634",
    appId: "1:614551187634:web:4e250169e702fbdc76d9ab",
    measurementId: "G-GE7XJ2RNDS"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };

//change for insert in github