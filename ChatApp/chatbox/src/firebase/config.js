
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLxbroNMgLyrBw_RG2ZlWQuE7nYeof5cw",
  authDomain: "vue3-firebase-projeler-ec1bb.firebaseapp.com",
  projectId: "vue3-firebase-projeler-ec1bb",
  storageBucket: "vue3-firebase-projeler-ec1bb.appspot.com",
  messagingSenderId: "757875936119",
  appId: "1:757875936119:web:5dc58695b7fa0c1b622f72"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const time = serverTimestamp;

export { auth, db, time };
