import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Input } from "./input.components";
import { InputValidation } from "../../../utils/actions/form-actions";
import { reducer } from "../../../utils/reducers/form-reducer";
import { SubmitButton } from "../../../components/submit-button";
import { SignUp } from "../../../utils/actions/auth-actions";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";

const initialState = {

    inputValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    },

    inputValidities: {
        firstName: false,
        lastName: false,
        email: false,
        password: false
    },

    inputIsValidColor: {
        firstName: "grey",
        lastName: "grey",
        email: "grey",
        password: "grey"
    },

    formIsValid: false
};

export const SignUpForm = props => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch();

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert("An error occured", error)
        };
    }, [error])

    const authHandler = async () => {

        try {
            setIsloading(true);
            const action = SignUp(
                formState.inputValues.firstName,
                formState.inputValues.lastName,
                formState.inputValues.email,
                formState.inputValues.password
            );

            await dispatch(action);
            setIsloading(false);
        } catch (error) {
            setError(error.message)
            console.log(error.message);
            setIsloading(false)
        }

    }

    return (
        <>
            <Input
                id="firstName"
                label="First name"
                labelColor={formState.inputIsValidColor["firstName"]}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["firstName"]}
                color={formState.inputIsValidColor["firstName"]}
            />

            <Input
                id="lastName"
                label="Last name"
                labelColor={formState.inputIsValidColor["lastName"]}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["lastName"]}
                color={formState.inputIsValidColor["lastName"]}

            />

            <Input
                id="email"
                label="Email"
                labelColor={formState.inputIsValidColor["email"]}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["email"]}
                keyboardType="email-address"
                color={formState.inputIsValidColor["email"]}

            />

            <Input
                id="password"
                label="Password"
                labelColor={formState.inputIsValidColor["password"]}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["password"]}
                secureTextEntry
                color={formState.inputIsValidColor["password"]}
            />

            {
                isLoading ?
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} /> :
                    <SubmitButton
                        title="Sign up"
                        disabled={!formState.formIsValid}
                        onPress={authHandler}
                    />
            }
        </>
    );
};