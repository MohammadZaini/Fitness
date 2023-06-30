import { child, endAt, get, getDatabase, orderByChild, query, ref, startAt } from "firebase/database";
import { getFirebaseApp } from "../firebase-helper"

export const getUserData = async (userId, personType) => {

    try {
        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));

        let type;
        if (personType === "trainee") {
            type = "trainees"
        } else if (personType === "coach") {
            type = "coaches"
        };

        const userRef = child(dbRef, `${type}/${userId}`);
        const snapshot = await get(userRef)

        return snapshot.val();

    } catch (error) {
        console.log(error);
    };
};

export const searchUsers = async (queryText) => {
    const searchTerm = queryText.toLowerCase();
    try {

        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));

        const traineesRef = child(dbRef, 'trainees');
        const coachesRef = child(dbRef, 'coaches');

        const queryTraineesRef = query(traineesRef, orderByChild('firstLast'), startAt(searchTerm), endAt(searchTerm + "\uf8ff"));
        const queryCoachesRef = query(coachesRef, orderByChild('firstLast'), startAt(searchTerm), endAt(searchTerm + "\uf8ff"));

        const traineesSnapshot = await get(queryTraineesRef);
        const coachesSnapshot = await get(queryCoachesRef);

        if (traineesSnapshot.exists() || coachesSnapshot.exists()) {
            return { ...traineesSnapshot.val(), ...coachesSnapshot.val() };
        };

        return {};

    } catch (error) {
        console.log(error);
        throw error;
    };
};