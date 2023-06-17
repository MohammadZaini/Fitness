import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./main.navigator";
import AuthScreen from "../../features/account/screens/auth.screen";
import { useSelector } from "react-redux";

const Navigation = () => {
    const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "");
    return (
        <NavigationContainer>

            {
                isAuth ? < StackNavigator /> : <AuthScreen />
            }

        </NavigationContainer>
    )
}

export default Navigation;