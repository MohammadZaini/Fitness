import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./main.navigator";
import AuthScreen from "../../features/account/screens/auth.screen";
import { useSelector } from "react-redux";
import StartUpScreen from "../../features/account/screens/start-up.screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "../../../onboarding/onboarding";
import { navigationRef } from "../../../navigation-ref";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../theme/colors";

const Navigation = () => {
    const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "");
    const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

    const [isloading, setIsLoading] = useState(true);
    const [viewedOnboarding, setViewedOnboarding] = useState(false);

    AsyncStorage.removeItem("@viewedOnboarding");

    const Loading = () => {
        return <View style={{ justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    };

    const checkOnboarding = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem('@viewedOnboarding');

            if (value !== null) {
                setViewedOnboarding(true);
            } else {
                // console.log(value);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }, [viewedOnboarding]);

    useEffect(() => {
        checkOnboarding();
    }, []);

    const switchValue = (value = false) => {
        setViewedOnboarding(value)
    };

    return (
        <NavigationContainer ref={navigationRef}  >

            {
                isloading ? <Loading /> : !viewedOnboarding && <Onboarding swap={switchValue} />
            }

            {isAuth && <StackNavigator />}
            {!isAuth && didTryAutoLogin && viewedOnboarding && <AuthScreen />}
            {!isAuth && !didTryAutoLogin && viewedOnboarding && <StartUpScreen />}

        </NavigationContainer>
    )
};

export default Navigation;
