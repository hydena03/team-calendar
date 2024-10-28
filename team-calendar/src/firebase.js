// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBti68ytinYVc-5D3opnCaTSSCb3ncMliY",
    authDomain: "team-calendar-julsenara.firebaseapp.com",
    projectId: "team-calendar-julsenara",
    storageBucket: "team-calendar-julsenara.appspot.com",
    messagingSenderId: "745605663104",
    appId: "1:745605663104:web:dca59bca8a184bb6f95965",
    measurementId: "G-VRL49TQ3FC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);