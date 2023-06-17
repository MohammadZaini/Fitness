import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./main.navigator";
import AuthScreen from "../../features/account/screens/auth.screen";
import { useSelector } from "react-redux";
import StartUpScreen from "../../features/account/screens/start-up.screen";

const Navigation = () => {
    const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "");
    const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

    return (
        <NavigationContainer>

            {
                isAuth && < StackNavigator />
            }

            {
                !isAuth && didTryAutoLogin && <AuthScreen />
            }

            {
                !isAuth && !didTryAutoLogin && <StartUpScreen />

            }

        </NavigationContainer>
    )
}

export default Navigation;