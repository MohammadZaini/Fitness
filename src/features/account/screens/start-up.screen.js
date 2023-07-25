import React from "react";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { authenticate, setDidTryAutoLogin } from "../../../../store/auth-slice";
import { getUserData } from "../../../utils/actions/user-actions";
import { styled } from "styled-components";
import { getUserType } from "../../../utils/actions/auth-actions";

const StartUpScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryAutoLogin = async () => {
            const storedAuthInfo = await AsyncStorage.getItem("userToken");

            if (!storedAuthInfo) {
                dispatch(setDidTryAutoLogin());
                return;
            }

            const parsedData = JSON.parse(storedAuthInfo);
            const { token, userId, expiryDate: expiryDateString } = parsedData;
            const expiryDate = new Date(expiryDateString);

            const localUserType = await AsyncStorage.getItem(`type-${userId}`);
            const userType = await getUserType(userId);

            if (expiryDate <= new Date || !token || !userId) {
                dispatch(setDidTryAutoLogin());
                return;
            };

            const userData = await getUserData(userId, userType ?? localUserType);
            dispatch(authenticate({ token, userData }));
        };
        tryAutoLogin();
    }, [dispatch]);

    return (
        <LoadingContainer >
            <ActivityIndicator size="large" color={colors.primary} />
        </LoadingContainer>
    );
};

export default StartUpScreen;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;