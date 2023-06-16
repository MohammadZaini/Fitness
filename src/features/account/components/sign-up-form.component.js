import React, { useCallback, useReducer, useState } from "react";
import { Input } from "./input.components";
import { InputValidation } from "../../../utils/actions/form-actions";
import { reducer } from "../../../utils/reducers/form-reducer";
import { SubmitButton } from "../../../components/submit-button";
import { SignUp } from "../../../utils/actions/auth-actions";
import { Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";

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

    formIsValid: false
};

export const SignUpForm = props => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState("");

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const authHandler = async () => {

        try {
            setIsloading(true)
            await SignUp(
                formState.inputValues.firstName,
                formState.inputValues.lastName,
                formState.inputValues.email,
                formState.inputValues.password
            )

        } catch (error) {
            setError(error)
            console.log(error.message);
        } finally {
            setIsloading(false)
        }

    }

    return (
        <>
            <Input
                id="firstName"
                label="First name"
                onInputChanged={onChangedHandler}
                errorText={formState.inputValidities["firstName"]}
            />

            <Input
                id="lastName"
                label="Last name"
                onInputChanged={onChangedHandler}
                errorText={formState.inputValidities["lastName"]}
            />

            <Input
                id="email"
                label="Email"
                onInputChanged={onChangedHandler}
                errorText={formState.inputValidities["email"]}
                keyboardType="email-address"
            />

            <Input
                id="password"
                label="Password"
                onInputChanged={onChangedHandler}
                errorText={formState.inputValidities["password"]}
                secureTextEntry
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


            {
                error &&
                <Text>{error}</Text>
            }
        </>
    )
}