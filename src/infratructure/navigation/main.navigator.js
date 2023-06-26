import React, { useEffect, useState } from "react";
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack";
import NewChatScreen from "../../features/chat/screens/new-chat.screen";
import ChatScreen from "../../features/chat/screens/chat.screens";
import ChatSettingsScreen from "../../features/chat/screens/chat-settings.screen";
import TabNavigator from "./app.navigator";
import { useDispatch, useSelector } from "react-redux";
import { getFirebaseApp } from "../../utils/firebase-helper";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { setChatsData } from "../../../store/chat-slice";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../theme/colors";
import { styled } from "styled-components";
import { setStoredUsers } from "../../../store/user-slice";
import { setChatMessages, setStarredMessages } from "../../../store/messages-slice";
import ExersiceDetails from "../../features/exercises/screens/exercise-details.screen";
import Onboarding from "../../../onboarding/onboarding";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

const StackNavigator = () => {

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);

    useEffect(() => {
        console.log("Subscribing to firebase listener");

        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const userChatsRef = child(dbRef, `userChats/${userData.userId}`);
        const refs = [userChatsRef];

        /* When the app loads we retrieve the chat ids (that the user is part of ).
        Then we loop over them one by one and retreive the actual data for those chats.
        And once we got the chat data for all of the chats that the user's part of, we 
        dispatch that and save the chat data to our state.  
        */
        onValue(userChatsRef, (querySnapshot) => {
            const chatIdData = querySnapshot.val() || {};
            const chatIds = Object.values(chatIdData);

            const chatsData = {};
            let chatsFoundCount = 0;

            for (let i = 0; i < chatIds.length; i++) {
                const chatId = chatIds[i];
                const chatRef = child(dbRef, `chats/${chatId}`);
                refs.push(chatRef)

                // Chat data
                onValue(chatRef, (chatSnapshot) => {
                    chatsFoundCount++

                    const data = chatSnapshot.val();

                    if (data) {

                        if (!data.users.includes(userData.userId)) {
                            return;
                        }

                        data.key = chatSnapshot.key;

                        data.users.forEach(userId => {
                            if (storedUsers[userId]) return;
                            const coachesRef = child(dbRef, `coaches/${userId}`);
                            const traineesRef = child(dbRef, `trainees/${userId}`);

                            // "get" only gets data and doesn't listen to changes, unlike "onValue"

                            get(coachesRef)
                                .then(coachesSnapshot => {
                                    const coachesSnapshotData = coachesSnapshot.val();
                                    dispatch(setStoredUsers({ newUsers: { coachesSnapshotData } }))
                                });

                            refs.push(coachesRef);

                            get(traineesRef)
                                .then(traineesSnapshot => {
                                    const traineesSnapshotData = traineesSnapshot.val();
                                    dispatch(setStoredUsers({ newUsers: { traineesSnapshotData } }))
                                });

                            refs.push(traineesRef);


                        });

                        chatsData[chatSnapshot.key] = data
                    };

                    // Checks if we loaded all of the chats.
                    if (chatsFoundCount >= chatIds.length) {
                        dispatch(setChatsData({ chatsData }));
                        setIsLoading(false);
                    };
                });

                const messagesRef = child(dbRef, `messages/${chatId}`);
                refs.push(messagesRef);

                onValue(messagesRef, messagesSnapshot => {
                    const messagesData = messagesSnapshot.val();
                    dispatch(setChatMessages({ chatId, messagesData }));
                });

                // If there were no chats.
                if (chatsFoundCount == 0) {
                    setIsLoading(false);
                }
            };
        });

        const userStarredMessagesRef = child(dbRef, `starredMessages/${userData.userId}`);
        refs.push(userStarredMessagesRef);

        onValue(userStarredMessagesRef, querySnapshot => {
            const starredMessages = querySnapshot.val() ?? {};
            dispatch(setStarredMessages({ starredMessages }))
        })

        return () => {
            console.log("Unsubscribing to firebase listener");
            refs.forEach(ref => off(ref));
        };

    }, []);

    if (isLoading) {
        <LoadingContainer >
            <ActivityIndicator size="large" color={colors.primary} />
        </LoadingContainer>
    };

    return (
        <Stack.Navigator   >

            <Stack.Group screenOptions={{ headerShown: false }} >

                <Stack.Screen name="Home" component={TabNavigator} options={{ headerTitle: '', headerShadowVisible: false }} />
                <Stack.Screen name="ChatSettings" component={ChatSettingsScreen} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: "modal" }}>
                <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShadowVisible: false, ...TransitionPresets.SlideFromRightIOS, }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ headerShadowVisible: false, ...TransitionPresets.SlideFromRightIOS, }} >
                <Stack.Screen name="NewChat" component={NewChatScreen} options={{ title: "New chat" }} />
                <Stack.Screen name="ExerciseDetails" component={ExersiceDetails} options={{ title: "Exercise" }} />
            </Stack.Group>

        </Stack.Navigator>
    );
};

export default StackNavigator;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;


const OnboardingStack = createStackNavigator();

export const OnboardingNavigation = () => {
    return <NavigationContainer>
        <OnboardingStack.Navigator>

            <OnboardingStack.Group screenOptions={{ headerShadowVisible: false, ...TransitionPresets.SlideFromRightIOS, headerShown: false }}>
                <OnboardingStack.Screen name="Onboarding" component={Onboarding} />
            </OnboardingStack.Group>

            <OnboardingStack.Group screenOptions={{ headerShown: false }} >
                <OnboardingStack.Screen name="Home" component={TabNavigator} options={{ headerTitle: '', headerShadowVisible: false }} />
                <OnboardingStack.Screen name="ChatSettings" component={ChatSettingsScreen} />
            </OnboardingStack.Group>

            <OnboardingStack.Group>
                <OnboardingStack.Screen name="Chat" component={ChatScreen} options={{ headerShadowVisible: false, ...TransitionPresets.ModalPresentationIOS, }} />
            </OnboardingStack.Group>

            <OnboardingStack.Group screenOptions={{ headerShadowVisible: false, ...TransitionPresets.SlideFromRightIOS, }} >
                <OnboardingStack.Screen name="NewChat" component={NewChatScreen} options={{ title: "New chat" }} />
                <OnboardingStack.Screen name="ExerciseDetails" component={ExersiceDetails} options={{ title: "Exercise" }} />
            </OnboardingStack.Group>

        </OnboardingStack.Navigator>
    </NavigationContainer>
}