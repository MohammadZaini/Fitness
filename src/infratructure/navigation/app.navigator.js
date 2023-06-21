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
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Exersices"
                component={ExersicesScreen}
                options={{
                    tabBarIcon: () => <FontAwesome5 name="dumbbell" size={24} color={colors.primary} />,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.veryLightBlue,
                }} />

            <Tab.Screen
                name="Chats"
                component={ChatListScreen}
                options={{
                    tabBarIcon: () => <Ionicons name="md-chatbubbles-outline" size={24} color={colors.primary} />,
                    tabBarLabel: "Chats",
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.veryLightBlue,
                    headerShown: true,
                    headerShadowVisible: false
                }} />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: () => <Ionicons name="settings-outline" size={24} color={colors.primary} />,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.veryLightBlue
                }} />
        </Tab.Navigator>
    );
};

export default TabNavigator;