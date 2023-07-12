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
import { Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

const isTestMode = true

const initialState = {

    inputValues: {
        email: isTestMode ? "zaini@outlook.com" : "",
        password: isTestMode ? "zaini123" : ""
    },

    inputValidities: {
        email: false,
        password: false
    },

    inputIsValidColor: {
        email: "grey",
        password: "grey"
    },

    formIsValid: isTestMode
};
export const SignInForm = props => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const [rememberMe, setRememberMe] = useState(true);
    const [hidePassword, setHidePassword] = useState(true)

    useEffect(() => {
        if (error) {
            Alert.alert("An error occured", error)
        };
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
            setIsloading(false);
        } catch (error) {
            setError(error.message)
            console.log(error.message);
            setIsloading(false)
        }

    }, [dispatch, formState]);

    // const rememberUser = (emailValue, passwordValue) => {
    //     setRememberMe(prevState => !prevState);

    //     AsyncStorage.setItem("rememberMe",JSON.stringify({
    //         emailValue,
    //         passwordValue
    //     }) )
    // }

    return (
        <>
            <Input
                id="email"
                label="Email"
                labelColor={formState.inputIsValidColor["email"]}
                iconPack={MaterialIcons}
                icon={"email"}
                iconColor={colors.primary}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["email"]}
                keyboardType="email-address"
                color={formState.inputIsValidColor["email"]}
                initialValue={formState.inputValues.email}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Input
                    id="password"
                    label="Password"
                    labelColor={formState.inputIsValidColor["password"]}
                    iconPack={Entypo}
                    icon={"lock"}
                    iconColor={colors.primary}
                    onInputChanged={onChangedHandler}
                    autoCapitalize='none'
                    autoCorrect={false}
                    errorText={formState.inputValidities["password"]}
                    secureTextEntry={hidePassword}
                    color={formState.inputIsValidColor["password"]}
                    initialValue={formState.inputValues.password}
                />
                {

                    hidePassword ?
                        <Ionicons name="md-eye-off-outline" size={20}
                            color="black"
                            style={{ alignSelf: 'center', position: 'absolute', right: 15, bottom: 12 }}
                            onPress={() => setHidePassword(!hidePassword)}
                        /> :
                        <Ionicons name="md-eye-outline" size={20}
                            color="black"
                            style={{ alignSelf: 'center', position: 'absolute', right: 15, bottom: 12 }}
                            onPress={() => setHidePassword(!hidePassword)}
                        />
                }
            </View>

            {/* {
    rememberMe ?
    <MaterialIcons name="check-box-outline-blank" size={24} 
color="black" style={{alignSelf: 'flex-start', marginLeft: 50, marginTop: 5}}
onPress={() => setRememberMe(prevState => !prevState)}
/>  :
<MaterialIcons name="check-box" size={24} color={colors.primary}
style={{alignSelf: 'flex-start', marginLeft: 50, marginTop: 5}}
onPress={() => setRememberMe(prevState => !prevState)}
/>
} */}
            {
                isLoading ?
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20, marginBottom: 5 }} /> :
                    <SubmitButton
                        title="Sign In"
                        disabled={!formState.formIsValid}
                        onPress={authHandler}
                    />
            }
        </>
    )
};