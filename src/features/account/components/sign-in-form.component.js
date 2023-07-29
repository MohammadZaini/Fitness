import React, { useCallback, useEffect, useReducer } from "react";
import { Input } from "./input.components";
import { reducer } from "../../../utils/reducers/form-reducer";
import { InputValidation } from "../../../utils/actions/form-actions";
import { SubmitButton } from "../../../components/submit-button";
import { SignIn } from "../../../utils/actions/auth-actions";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'
import { Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { styled } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

const isTestMode = false

const initialState = {

    inputValues: {
        email: isTestMode ? "zaini@outlook.com" : "",
        password: isTestMode ? "zaini12345" : ""
    },

    inputValidities: {
        email: false,
        password: false
    },

    inputIsValidColor: {
        email: "grey",
        password: "grey"
    },

    formIsValid: false
};

export const SignInForm = props => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const [rememberMe, setRememberMe] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);
    const [rememberMeData, setRememberMeData] = useState([]);

    const isPasswordInputValid = formState.inputValidities["password"];

    useEffect(() => {
        if (error) {
            Alert.alert("An error occured", error);
        };

        const getRemeberedUserCredentials = async () => {
            try {
                const userCredentials = await getUserCredentials();

                if (!userCredentials) return;

                setRememberMe(true);
                setRememberMeData(userCredentials)

            } catch (error) {
                console.log(error);
            };
        };

        getRemeberedUserCredentials();
    }, [error]);

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const authHandler = useCallback(async () => {

        try {
            setIsloading(true);
            const action = SignIn(
                formState.inputValues.email,
                formState.inputValues.password
            );
            setError(null);
            await dispatch(action);
            rememberUserCredentials(formState.inputValues.email, formState.inputValues.password);
            setIsloading(false);
        } catch (error) {
            setError(error.message)
            console.log(error.message);
            setIsloading(false)
        }

    }, [dispatch, formState]);

    const rememberUserCredentials = async (emailValue, passwordValue) => {

        rememberMe === true ?
            AsyncStorage.setItem("rememberMe", JSON.stringify({
                emailValue,
                passwordValue
            }))
            : AsyncStorage.removeItem("rememberMe");
    };

    const getUserCredentials = async () => {

        try {
            const userCredentials = await AsyncStorage.getItem("rememberMe");
            if (!userCredentials) return;
            const parsedData = JSON.parse(userCredentials);
            const { emailValue, passwordValue } = parsedData;

            return [emailValue, passwordValue];
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <>
            {
                <Input
                    id="email"
                    label="Email"
                    labelColor={formState.inputIsValidColor["email"]}
                    iconPack={MaterialIcons}
                    icon={"email"}
                    iconColor={formState.inputIsValidColor["email"]}
                    onInputChanged={onChangedHandler}
                    autoCapitalize='none'
                    autoCorrect={false}
                    errorText={formState.inputValidities["email"]}
                    keyboardType="email-address"
                    color={formState.inputIsValidColor["email"]}
                    initialValue={rememberMeData[0] && rememberMeData[0]}
                />
            }

            <PasswordInputContainer>
                {
                    <Input
                        id="password"
                        label="Password"
                        labelColor={formState.inputIsValidColor["password"]}
                        iconPack={Entypo}
                        icon={"lock"}
                        iconColor={formState.inputIsValidColor["password"]}
                        onInputChanged={onChangedHandler}
                        autoCapitalize='none'
                        autoCorrect={false}
                        errorText={formState.inputValidities["password"]}
                        secureTextEntry={hidePassword}
                        color={formState.inputIsValidColor["password"]}
                        initialValue={rememberMeData[1] && rememberMeData[1]}
                    />
                }

                {
                    formState.inputValues.password !== "" &&
                    (
                        hidePassword ?
                            <HideShowPasswordIcon name="md-eye-off-outline"
                                bottom={isPasswordInputValid ? 27 : 11}
                                onPress={() => setHidePassword(!hidePassword)}
                            /> :
                            <HideShowPasswordIcon name="md-eye-outline"
                                bottom={isPasswordInputValid ? 27 : 11}
                                onPress={() => setHidePassword(!hidePassword)}
                            />
                    )
                }
            </PasswordInputContainer>

            {
                rememberMe ?
                    <TouchableOpacity onPress={() => setRememberMe(prev => !prev)} style={{ alignSelf: "flex-start", marginLeft: 35, marginTop: 10 }}  >
                        <MaterialIcons name="check-box" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setRememberMe(prev => !prev)} style={{ alignSelf: "flex-start", marginLeft: 35, marginTop: 10 }}  >
                        <MaterialIcons name="check-box-outline-blank" size={24} color="grey" />
                    </TouchableOpacity>
            }

            {
                isLoading ?
                    <LoadingIndicator /> :
                    <SubmitButton
                        title="Sign In"
                        disabled={!formState.formIsValid}
                        onPress={authHandler}
                        style={{ marginTop: 10 }}
                    />
            }
        </>
    )
};

const LoadingIndicator = styled(ActivityIndicator).attrs({
    size: "small",
    color: colors.primary
})`
    margin-top: 20px;
    margin-bottom: 5px;
`;

export const HideShowPasswordIcon = styled(Ionicons).attrs(props => ({
    name: props.name,
    size: 20,
    color: colors.lightGrey,
    onPress: props.onPress
}))`
    position: absolute;
    bottom: ${props => props.bottom}px;
    right: 15px;
`;

const PasswordInputContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;