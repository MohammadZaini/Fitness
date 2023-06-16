import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./main.navigator";
import AuthScreen from "../../features/account/screens/auth.screen";

const Navigation = () => {
    const isAuth = true;
    return (
        <NavigationContainer>

            {
                !isAuth ? < StackNavigator /> : <AuthScreen />
            }

        </NavigationContainer>
    )
}

export default Navigation;