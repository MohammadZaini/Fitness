import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../../features/chat/screens/chat-list.screen";
import SettingsScreen from "../../features/settings/screens/settings.screen";
import ExersicesScreen from "../../features/exercises/screens/exercises.screen";
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Exersices"
                component={ExersicesScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: () => <FontAwesome5 name="dumbbell" size={24} color={colors.primary} />,
                    tabBarActiveTintColor: colors.primary
                }} />

            <Tab.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: () => <Ionicons name="md-chatbubbles-outline" size={24} color={colors.primary} />,
                    tabBarLabel: "Chats",
                    tabBarActiveTintColor: colors.primary
                }} />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: () => <Ionicons name="settings-outline" size={24} color={colors.primary} />,
                    tabBarActiveTintColor: colors.primary
                }} />
        </Tab.Navigator>
    );
};

export default TabNavigator;