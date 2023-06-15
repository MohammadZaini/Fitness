import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewChatScreen from "../../features/chat/screens/new-chat.screen";
import ChatScreen from "../../features/chat/screens/chat.screens";
import TabNavigator from "./app.navigator";

const Stack = createStackNavigator();

const StackNavigator = () => {

    return (
        <Stack.Navigator  >
            <Stack.Screen name="Home" component={TabNavigator} options={{ headerTitle: '', headerShadowVisible: false }} />
            <Stack.Screen name="NewChat" component={NewChatScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
    );
};

export default StackNavigator;