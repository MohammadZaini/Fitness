import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirebaseApp } from "../firebase-helper";
import { child, getDatabase, ref, set } from "firebase/database"

export const SignUp = async (firstName, lastName, email, password) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const { uid } = user;

            await createUser(firstName, lastName, email, uid);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            let message = "Something went wrong";

            if (errorCode === "auth/email-already-in-use") {
                message = "Email is already in use";
            }

        });
};

const createUser = async (firstName, lastName, email, userId) => {
    const firstLast = `${firstName} ${lastName}`.toLowerCase();

    const userData = {
        firstName,
        lastName,
        firstLast,
        email,
        userId,
        signUpDate: new Date().toDateString()
    };

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, `users/${userId}`)

    await set(childRef, userData);
    return userData;
};

