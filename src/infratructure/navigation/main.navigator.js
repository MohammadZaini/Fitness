import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import React, { useEffect, useRef, useState } from "react";
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
import { StackActions, useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

const StackNavigator = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(true);

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        console.log(expoPushToken);
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const { data } = response.notification.request.content;
            const chatId = data["chatId"];

            if (chatId) {
                const pushActions = StackActions.push("Chat", { chatId });
                navigation.dispatch(pushActions);

            } else {
                console.log("No chat id sent with notification");
            }

            console.log("Notification tapped:");
            console.log(JSON.stringify(response, 0, 2));
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

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
            const chatIdsData = querySnapshot.val() || {}; // chatKey: chatId.
            const chatIds = Object.values(chatIdsData); // ex. ["-NYjR4uHCJFF8f2Mi-H4", "-NYjRJDkK_6JDaRekhsN","-NYmwcDqwUcz-GT5cS1j"]

            const chatsData = {};
            let chatsFoundCount = 0;

            for (let i = 0; i < chatIds.length; i++) {
                console.log(i);
                const chatId = chatIds[i];
                const chatRef = child(dbRef, `chats/${chatId}`);
                refs.push(chatRef)

                // Chat data
                onValue(chatRef, (chatSnapshot) => { // createdAt: "...", latestMessageText: "...", users: [0: "...", 1: "..."] ......
                    chatsFoundCount++

                    const data = chatSnapshot.val();

                    if (data) {
                        if (!data.users.includes(userData.userId)) {
                            return;
                        }

                        data.key = chatSnapshot.key;
                        // console.log(JSON.stringify(chatSnapshot.key, 0, 2));
                        data.users.forEach(userId => {
                            if (storedUsers[userId]) return;
                            const coachesRef = child(dbRef, `coaches/${userId}`);
                            const traineesRef = child(dbRef, `trainees/${userId}`);

                            // "get" only gets data and doesn't listen to changes, unlike "onValue"

                            get(coachesRef)
                                .then(coachesSnapshot => {
                                    const coachesSnapshotData = coachesSnapshot.val();
                                    if (coachesSnapshotData) {
                                        dispatch(setStoredUsers({ newUsers: { coachesSnapshotData } }))
                                    }
                                });

                            refs.push(coachesRef);

                            get(traineesRef)
                                .then(traineesSnapshot => {
                                    const traineesSnapshotData = traineesSnapshot.val();
                                    if (traineesSnapshotData) {
                                        dispatch(setStoredUsers({ newUsers: { traineesSnapshotData } }))
                                    }
                                });
                            refs.push(traineesRef);
                        });

                        chatsData[chatSnapshot.key] = data
                        // console.log(chatsData[chatSnapshot.key] = data);
                    };

                    // Checks if we loaded all of the chats.
                    if (chatsFoundCount >= chatIds.length) {
                        dispatch(setChatsData({ chatsData }));
                        setIsLoading(false);
                    }
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
            dispatch(setChatsData({ chatsData }));
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
        <Stack.Navigator >

            <Stack.Group screenOptions={{ headerShown: false }} >
                <Stack.Screen name="Home" component={TabNavigator} options={{ headerTitle: '', headerShadowVisible: false }} />
                <Stack.Screen name="ChatSettings" component={ChatSettingsScreen} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: "modal" }}>
                <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShadowVisible: false, ...TransitionPresets.SlideFromRightIOS, }} />
            </Stack.Group>

            <Stack.Group screenOptions={{ headerShadowVisible: false, ...TransitionPresets.SlideFromRightIOS, }} >
                <Stack.Screen name="NewChat" component={NewChatScreen} options={{ title: "New chat" }} />
                <Stack.Screen name="ExerciseDetails" component={ExersiceDetails} options={{ title: "Exercise", headerShown: false }} />
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

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        try {
            token = (await Notifications.getExpoPushTokenAsync({ projectId: '2aac6eab732d3846' })).data;
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    };

    return token;
};