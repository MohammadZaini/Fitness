import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./main.navigator";
import AuthScreen from "../../features/account/screens/auth.screen";
import { useSelector } from "react-redux";
import StartUpScreen from "../../features/account/screens/start-up.screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "../../../onboarding/onboarding";

const Navigation = () => {
    const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "");
    const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

    // const [isloading, setIsLoading] = useState(true);
    // const [viewedOnboarding, setViewedOnboarding] = useState(true);

    // AsyncStorage.removeItem("@viewedOnboarding");
    0
    // const Loading = () => {
    //     return <View style={{ justifyContent: 'center', flex: 1 }}>
    //         <ActivityIndicator size="large" color={colors.primary} />
    //     </View>
    // }

    // const checkOnboarding = useCallback(async () => {
    //     try {
    //         const value = await AsyncStorage.getItem('@viewedOnboarding');

    //         if (value !== null) {
    //             console.log("has value");
    //             setViewedOnboarding(true);
    //         } else {
    //             console.log(value + ":o");
    //             // AsyncStorage.removeItem("@viewedOnboarding");
    //             // setViewedOnboarding(false);
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }, [viewedOnboarding]);

    // useEffect(() => {
    //     checkOnboarding();
    // }, [viewedOnboarding]);

    return (
        <NavigationContainer>

            {/* {
                viewedOnboarding &&
                <Onboarding />
            } */}
            {isAuth && <StackNavigator />}
            {!isAuth && didTryAutoLogin && <AuthScreen />}
            {!isAuth && !didTryAutoLogin && <StartUpScreen />}
            {/* {!isAuth && didTryAutoLogin && viewedOnboarding ? <AuthScreen /> : <Onboarding />} */}

        </NavigationContainer>
    )
}

export default Navigation;