import { isDevice } from "expo-device";
import * as Notification from "expo-notifications";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getFirebaseApp } from "../firebase-helper";
import { child, get, getDatabase, push, ref, set, update } from "firebase/database"
import { authenticate, logout } from "../../../store/auth-slice";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUserData } from "./user-actions";

let timer;

export const SignUp = (firstName, lastName, email, password, userType, gender) => {

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

                const userData = await createUser(firstName, lastName, email, uid, userType, gender);

                await setUserType(uid, userType);

                dispatch(authenticate({ token: accessToken, userData }));
                saveDatatoAsyncStorage(accessToken, uid, expiryDate);

                await storePushTokens(userData, userType);

                timer = setTimeout(() => {
                    dispatch(userLogout(userData, userType));
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

                const userType = await getUserType(uid);
                const localUserType = await AsyncStorage.getItem(`type-${uid}`);
                console.log(userType + localUserType);

                const userData = await getUserData(uid, userType ?? localUserType);
                dispatch(authenticate({ token: accessToken, userData }));
                saveDatatoAsyncStorage(accessToken, uid, expiryDate, userData.userType);
                await storePushTokens(userData, userType);

                timer = setTimeout(() => {
                    dispatch(userLogout(userData, userType));
                }, milliSecondsUntilExpiry);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                let message = "Something went wrong";

                if (errorCode === "auth/user-not-found" || errorCode === "auth/invalid-email") {
                    message = "Invalid email";
                } else if (errorCode === "auth/wrong-password") {
                    message = "Invalid password";
                } else if (errorCode === "auth/missing-email") {
                    message = "Please enter your email";
                } else if (errorCode === "auth/missing-password") {
                    message = "Please enter your password";
                }
                console.log(errorCode);
                throw new Error(message);
            });
    };
};

export const userLogout = (userData, userType) => {
    return async dispatch => {

        try {
            await removePushTokens(userData, userType);
        } catch (error) {
            console.log(error);
        };

        AsyncStorage.removeItem("userToken");
        clearTimeout(timer);
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

    const userType = await AsyncStorage.getItem(`type-${userId}`)
    if (userType === "coach") {
        path = `coaches/${userId}`
    } else if (userType === "trainee") {
        path = `trainees/${userId}`
    }

    const childRef = child(dbRef, path);
    await update(childRef, newData);
}

const createUser = async (firstName, lastName, email, userId, userType, gender) => {
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

    if (userType === "coach") {
        path = `coaches/${userId}`;
        userData.userType = userType;
        userData.gender = gender;

    } else if (userType === "trainee") {
        path = `trainees/${userId}`;
        userData.userType = userType;
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

const storePushTokens = async (userData, userType) => {
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

    if (userType === "coach") {
        path = "coaches";
    } else if (userType === "trainee") {
        path = "trainees";
    };

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `${path}/${userData.userId}/pushTokens`);

    await set(userRef, tokenData);
};

const removePushTokens = async (userData, userType) => {
    if (!isDevice) {
        return;
    };

    const token = (await Notification.getExpoPushTokenAsync()).data;

    const tokenData = await getUserPushTokens(userData.userId, userType);

    for (const key in tokenData) {
        if (tokenData[key] === token) {
            delete tokenData[key];
            break;
        };
    };

    let path;

    if (userType === "coach") {
        path = "coaches";
    } else if (userType === "trainee") {
        path = "trainees";
    };

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `${path}/${userData.userId}/pushTokens`);

    await set(userRef, tokenData);
};

export const getUserPushTokens = async (userId, userType) => {
    try {
        let path;
        if (userType === "coach") {
            path = "coaches";
        } else if (userType === "trainee") {
            path = "trainees";
        };

        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const userRef = child(dbRef, `${path}/${userId}/pushTokens`);
        console.log(path);
        const snapshot = await get(userRef);
        if (!snapshot || !snapshot.exists()) {
            return {};
        };

        return snapshot.val() || {};

    } catch (error) {
        console.log(error);
    };
};

export const refreshJwtToken = async () => {
    try {
        const app = getFirebaseApp();
        const auth = getAuth(app);
        const jwt = await auth.currentUser.getIdToken(true);
        console.log(jwt);
        // we will use jwt-decode (if required)
    } catch (error) {
        console.log(error);
    }
};

const setUserType = async (uid, userType) => {

    AsyncStorage.setItem(`type-${uid}`, userType);
    try {
        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const userRef = child(dbRef, `userType/${uid}`);

        await push(userRef, userType);

    } catch (error) {
        console.log(error);
    };
};

export const getUserType = async (uid) => {

    try {
        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const userRef = child(dbRef, `userType/${uid}`);

        const snapshot = await get(userRef);
        const data = snapshot.val();

        return Object.values(data).toString();

    } catch (error) {
        console.log(error);
    };
};

export const deleteUserAccount = () => {

    return dispatch => {

        try {
            const app = getFirebaseApp();
            const auth = getAuth(app);
            const user = auth.currentUser;

            deleteUser(user).then(() => {
                // User deleted.
                AsyncStorage.removeItem("userToken");
                clearTimeout(timer);
                dispatch(logout());

                console.log("deleted!!");
            }).catch((error) => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }
};