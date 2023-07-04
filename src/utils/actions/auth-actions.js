import { isDevice } from "expo-device";
import * as Notification from "expo-notifications";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseApp } from "../firebase-helper";
import { child, get, getDatabase, ref, set, update } from "firebase/database"
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

                const userData = await createUser(firstName, lastName, email, uid, personType, gender);
                dispatch(authenticate({ token: accessToken, userData }));
                saveDatatoAsyncStorage(accessToken, uid, expiryDate);
                getPersonType(uid, personType);
                await storePushTokens(userData, personType);

                timer = setTimeout(() => {
                    dispatch(userLogout(userData, personType));
                }, milliSecondsUntilExpiry);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                let message = "Something went wrong";

                if (errorCode === "auth/email-already-in-use") {
                    message = "Email is already in use";
                };

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

                const personType = await AsyncStorage.getItem(`type-${uid}`);
                console.log(personType + ":)");
                const userData = await getUserData(uid, personType);
                dispatch(authenticate({ token: accessToken, userData }));
                saveDatatoAsyncStorage(accessToken, uid, expiryDate, userData.personType);
                await storePushTokens(userData, personType);

                timer = setTimeout(() => {
                    dispatch(userLogout(userData, personType));
                }, milliSecondsUntilExpiry);
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

export const userLogout = (userData, personType) => {
    return async dispatch => {

        try {
            await removePushTokens(userData, personType);
        } catch (error) {
            console.log(error);
        };

        AsyncStorage.removeItem("userToken")
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

    const personType = await AsyncStorage.getItem(`type-${userId}`)
    if (personType === "coach") {
        path = `coaches/${userId}`
    } else if (personType === "trainee") {
        path = `trainees/${userId}`
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

const saveDatatoAsyncStorage = (token, userId, expiryDate) => {
    AsyncStorage.setItem("userToken", JSON.stringify({
        token,
        userId,
        expiryDate: expiryDate.toISOString(),
    }));
};

const getPersonType = (uid, personType) => {
    AsyncStorage.setItem(`type-${uid}`, personType)
};

const storePushTokens = async (userData, personType) => {
    if (!isDevice) {
        return;
    };

    const token = (await Notification.getExpoPushTokenAsync()).data;

    const tokenData = { ...userData.pushTokens } || {};
    const tokenArray = Object.values(tokenData);

    if (tokenArray.includes(token)) {
        return;
    };

    tokenArray.push(token);

    for (let i = 0; i < tokenArray.length; i++) {
        const tok = tokenArray[i];
        tokenData[i] = tok;
    };

    let path;

    if (personType === "coach") {
        path = "coaches";
    } else if (personType === "trainee") {
        path = "trainees";
    };

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `${path}/${userData.userId}/pushTokens`);

    await set(userRef, tokenData);
};

const removePushTokens = async (userData, personType) => {
    if (!isDevice) {
        return;
    };

    const token = (await Notification.getExpoPushTokenAsync()).data;

    const tokenData = await getUserPushTokens(userData.userId, personType);

    for (const key in tokenData) {
        if (tokenData[key] === token) {
            delete tokenData[key];
            break;
        };
    };

    let path;

    if (personType === "coach") {
        path = "coaches";
    } else if (personType === "trainee") {
        path = "trainees";
    };

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `${path}/${userData.userId}/pushTokens`);

    await set(userRef, tokenData);
};

export const getUserPushTokens = async (userId, personType) => {
    try {
        let path;
        if (personType === "coach") {
            path = "coaches";
        } else if (personType === "trainee") {
            path = "trainees";
        };

        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const userRef = child(dbRef, `${path}/${userId}/pushTokens`);

        const snapshot = await get(userRef);
        if (!snapshot || !snapshot.exists()) {
            return {};
        };

        return snapshot.val() || {};

    } catch (error) {
        console.log(error);
    };
};