import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewChatScreen from "../../features/chat/screens/new-chat.screen";
import ChatScreen from "../../features/chat/screens/chat.screens";
import ChatSettingsScreen from "../../features/chat/screens/chat-settings.screen";
import TabNavigator from "./app.navigator";
import { useDispatch, useSelector } from "react-redux";
import { getFirebaseApp } from "../../utils/firebase-helper";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { setChatsData } from "../../../store/chat-slice";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../theme/colors";
import { styled } from "styled-components";
import { setStoredUsers } from "../../../store/user-slice";
import { setChatMessages } from "../../../store/messages-slice";

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
        const chatUsersRef = child(dbRef, `chatUsers/${userData.userId}`);
        const refs = [chatUsersRef];

        const chatsData = {};
        let chatsFoundCount = 0;

        /* When the app loads we retrieve the chat ids (the user is part of ).
        Then we loop over them one by one and retreive the actual data for those chats.
        And once we got the chat data for all of the chats that the user's part of, we 
        dispatch that and save the chat data to our state.  
        */
        onValue(chatUsersRef, (querySnapshot) => {
            const chatUserData = querySnapshot.val() || {};
            const chatIds = Object.values(chatUserData);

            for (let i = 0; i < chatIds.length; i++) {
                const chatId = chatIds[i];
                const chatRef = child(dbRef, `chats/${chatId}`);
                refs.push(chatRef)

                // Chat data
                onValue(chatRef, (chatSnapshot) => {
                    chatsFoundCount++

                    const data = chatSnapshot.val();

                    if (data) {
                        data.key = chatSnapshot.key;

                        data.users.forEach(userId => {
                            if (storedUsers[userId]) return;
                            const userRef = child(dbRef, `users/${userId}`);

                            // "get" only gets data and doesn't listen to changes, unlike "onValue"
                            get(userRef)
                                .then(userSnapshot => {
                                    const userSnapshotData = userSnapshot.val();
                                    dispatch(setStoredUsers({ newUsers: { userSnapshotData } }))
                                });

                            refs.push(userRef);
                        })

                        chatsData[chatSnapshot.key] = data
                    };

                    const messagesRef = child(dbRef, `messages/${chatId}`);

                    onValue(messagesRef, messagesSnapshot => {
                        const messagesData = messagesSnapshot.val();
                        dispatch(setChatMessages({ chatId, messagesData }));
                    });

                    // Checks if we loaded all of the chats.
                    if (chatsFoundCount >= chatIds.length) {
                        dispatch(setChatsData({ chatsData }));
                        setIsLoading(false);
                    };
                });

                // If there were no chats.
                if (chatsFoundCount == 0) {
                    setIsLoading(false);
                }
            };
        });

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
        <Stack.Navigator  >

            <Stack.Group screenOptions={{ headerShown: false }} >
                <Stack.Screen name="Home" component={TabNavigator} options={{ headerTitle: '', headerShadowVisible: false }} />
                <Stack.Screen name="ChatSettings" component={ChatSettingsScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'modal', title: "New chat", headerShadowVisible: false }} >
                <Stack.Screen name="NewChat" component={NewChatScreen} />
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