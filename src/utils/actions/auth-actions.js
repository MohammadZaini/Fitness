import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirebaseApp } from "../firebase-helper";
import { child, getDatabase, ref, set } from "firebase/database"
import { authenticate } from "../../../store/auth-slice";
import AsyncStorage from "@react-native-async-storage/async-storage"

export const SignUp = (firstName, lastName, email, password) => {

    return async dispatch => {
        const app = getFirebaseApp();
        const auth = getAuth(app);

        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const { uid, stsTokenManager } = user;
                const { accessToken, expirationTime } = stsTokenManager;

                const expiryDate = new Date(expirationTime);

                const userData = await createUser(firstName, lastName, email, uid);
                dispatch(authenticate({ token: accessToken, userData }));

                saveDatatoAsyncStorage(accessToken, uid, expiryDate)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                let message = "Something went wrong";

                if (errorCode === "auth/email-already-in-use") {
                    message = "Email is already in use";
                }

                throw new Error(message);
            });
    };
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

const saveDatatoAsyncStorage = (token, userId, expiryDate) => {
    AsyncStorage.setItem("userData", JSON.stringify({
        token,
        userId,
        expiryDate: expiryDate.toISOString()
    }));
};

