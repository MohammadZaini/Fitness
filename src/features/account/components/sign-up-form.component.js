import React, { useCallback, useReducer } from "react";
import { Input } from "./input.components";
import { InputValidation } from "../../../utils/actions/form-actions";
import { reducer } from "../../../utils/reducers/form-reducer";
import { SubmitButton } from "../../../components/submit-button";

const initialState = {

    inputValidities: {
        firstName: false,
        lastName: false,
        email: false,
        password: false
    },

    formIsValid: false
};

export const SignUpForm = props => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

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

            <SubmitButton
                title="Sign up"
                isEnabled={formState.formIsValid}
            />
        </>
    )
}