import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { authenticate, setDidTryAutoLogin } from "../../../../store/auth-slice";
import { getUserData } from "../../../utils/actions/user-actions";

const StartUpScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryAutoLogin = async () => {
            const storedAuthInfo = await AsyncStorage.getItem("userData")

            if (!storedAuthInfo) {
                dispatch(setDidTryAutoLogin());
                return;
            }

            const parsedData = JSON.parse(storedAuthInfo);
            const { token, userId, expiryDate: expirationTime } = parsedData;
            const expiryDate = new Date(expirationTime);

            if (expiryDate <= new Date() || !token || !userId) {
                dispatch(setDidTryAutoLogin());
                return;
            }

            const userData = await getUserData(userId);
            dispatch(authenticate(token, userData))
        };

        tryAutoLogin();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    )
};

export default StartUpScreen;