import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC9WE3pcSfq61qd5Vmph7i1Z7zTRzk5EFA",
    authDomain: "studenthub-8cf7c.firebaseapp.com",
    projectId: "studenthub-8cf7c",
    storageBucket: "studenthub-8cf7c.firebasestorage.app",
    messagingSenderId: "1028628751851",
    appId: "1:1028628751851:web:63683882a938c0a436a5ae",
    measurementId: "G-3LVZMGN0SN",
    databaseURL:"https://studenthub-8cf7c-default-rtdb.firebaseio.com"
  };
  
  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);