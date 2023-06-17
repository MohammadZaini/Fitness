import React, { useCallback, useReducer } from "react";
import { Input } from "./input.components";
import { reducer } from "../../../utils/reducers/form-reducer";
import { InputValidation } from "../../../utils/actions/form-actions";
import { SubmitButton } from "../../../components/submit-button";
import { SignIn } from "../../../utils/actions/auth-actions";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";

const initialState = {

    inputValues: {
        email: "",
        password: ""
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
    const dispatch = useDispatch();

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

            await dispatch(action);
            setIsloading(false);
        } catch (error) {
            setError(error.message)
            console.log(error.message);
            setIsloading(false)
        }

    }, [dispatch, formState])

    return (
        <>
            <Input
                id="email"
                label="Email"
                onInputChanged={onChangedHandler}
                errorText={formState.inputValidities["email"]}
                keyboardType="email-address"
                autoCapitalize='none'
                autoCorrect={false}
                color={formState.inputIsValidColor["email"]}
            />

            <Input
                id="password"
                label="Password"
                onInputChanged={onChangedHandler}
                errorText={formState.inputValidities["password"]}
                secureTextEntry
                color={formState.inputIsValidColor["password"]}
            />

            {
                isLoading ?
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} /> :
                    <SubmitButton
                        title="Sign In"
                        isEnabled={formState.formIsValid}
                        onPress={authHandler}
                    />
            }
        </>
    )
};