import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewChatScreen from "../../features/chat/screens/new-chat.screen";
import ChatScreen from "../../features/chat/screens/chat.screens";
import ChatSettingsScreen from "../../features/chat/screens/chat-settings.screen";
import TabNavigator from "./app.navigator";

const Stack = createStackNavigator();

const StackNavigator = () => {

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