import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAuJ6orlazSAurnuHEKLBMwAmDa-whXSXc",
    authDomain: "realtime-database-3d9de.firebaseapp.com",
    databaseURL: "https://realtime-database-3d9de-default-rtdb.firebaseio.com",
    projectId: "realtime-database-3d9de",
    storageBucket: "realtime-database-3d9de.firebasestorage.app",
    messagingSenderId: "438207463925",
    appId: "1:438207463925:web:e2e978fe1732e6a51e20bc",
    measurementId: "G-H9JX0DNVSF"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
