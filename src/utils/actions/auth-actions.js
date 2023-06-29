import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseApp } from "../firebase-helper";
import { child, getDatabase, ref, set, update } from "firebase/database"
import { authenticate, logout } from "../../../store/auth-slice";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUserData } from "./user-actions";

let timer;

export const SignUp = (firstName, lastName, email, password, personType, gender) => {

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
                const timeNow = new Date();

                const milliSecondsUntilExpiry = expiryDate - timeNow;

                timer = setTimeout(() => {
                    dispatch(userLogout());
                }, milliSecondsUntilExpiry);

                const userData = await createUser(firstName, lastName, email, uid, personType, gender);
                dispatch(authenticate({ token: accessToken, userData }));

                saveDatatoAsyncStorage(accessToken, uid, expiryDate, personType)

                getPersonType(personType)
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

export const SignIn = (email, password) => {

    return async dispatch => {
        const app = getFirebaseApp();
        const auth = getAuth(app);

        await signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                const { uid, stsTokenManager } = user;
                const { accessToken, expirationTime } = stsTokenManager;

                const expiryDate = new Date(expirationTime);
                const timeNow = new Date();

                const milliSecondsUntilExpiry = expiryDate - timeNow;

                timer = setTimeout(() => {
                    dispatch(userLogout());
                }, milliSecondsUntilExpiry);

                const personType = await AsyncStorage.getItem("type")
                console.log(JSON.stringify(personType, 0, 2));

                // if (!personType) {
                //     throw new Error()
                // };

                const userData = await getUserData(uid, personType ?? "coach");
                dispatch(authenticate({ token: accessToken, userData }));

                saveDatatoAsyncStorage(accessToken, uid, expiryDate, userData.personType);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                let message = "Something went wrong";

                if (errorCode === "auth/user-not-found") {
                    message = "Invalid email";
                } else if (errorCode === "auth/wrong-password") {
                    message = "Invalid password";
                };

                throw new Error(message);
            });
    };
};

export const userLogout = () => {
    return async dispatch => {
        AsyncStorage.clear();
        clearTimeout(timer)
        dispatch(logout());
    };
};

export const updatedSignedInUserData = async (userId, newData) => {
    if (newData.firstLast && newData.lastName) {
        const firstLast = `${newData.firstName} ${newData.lastName}`.toLowerCase();
        newData.firstLast = firstLast;
    };

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));

    let path;

    if (newData.personType === "coach") {
        path = `coaches/${userId}`
    } else if (newData.personType === "trainee") {
        path = `trainees/${userId}`
    } else {
        path = `coaches/${userId}`
        console.log("hmmm");
        // return;
    }

    const childRef = child(dbRef, path);

    await update(childRef, newData);
}

const createUser = async (firstName, lastName, email, userId, personType, gender) => {
    const firstLast = `${firstName} ${lastName}`.toLowerCase();

    const userData = {
        firstName,
        lastName,
        firstLast,
        email,
        userId,
        signUpDate: new Date().toDateString()
    };

    let path;

    if (personType === "coach") {
        path = `coaches/${userId}`;
        userData.personType = personType;
        userData.gender = gender;

    } else if (personType === "trainee") {
        path = `trainees/${userId}`;
        userData.personType = personType;
        userData.gender = gender;

    } else {
        return;
    }

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const childRef = child(dbRef, path)

    await set(childRef, userData);

    return userData;
};

const saveDatatoAsyncStorage = (token, userId, expiryDate, personType) => {
    AsyncStorage.setItem("userToken", JSON.stringify({
        token,
        userId,
        expiryDate: expiryDate.toISOString(),
        personType
    }));
};

const getPersonType = (personType) => {
    AsyncStorage.setItem("type", personType)
}