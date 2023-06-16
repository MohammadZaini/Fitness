// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyBlw4nxZ-VK2629jpbaDfZBb_736zgo_Co",
        authDomain: "fitness-719f4.firebaseapp.com",
        projectId: "fitness-719f4",
        storageBucket: "fitness-719f4.appspot.com",
        messagingSenderId: "176175208214",
        appId: "1:176175208214:web:3a1ac297a407c06217e237",
        measurementId: "G-98Z0YC86P4"
    };

    // Initialize Firebase
    return initializeApp(firebaseConfig);
};
