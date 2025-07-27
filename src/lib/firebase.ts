// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "expensewise-835o8",
  "appId": "1:316499927361:web:064df7d6d45f74da10c1c0",
  "storageBucket": "expensewise-835o8.firebasestorage.app",
  "apiKey": "AIzaSyDCpXN5abOH2ghLPJJoD357_jqiT0rQtmU",
  "authDomain": "expensewise-835o8.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "316499927361"
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}


export default app;
