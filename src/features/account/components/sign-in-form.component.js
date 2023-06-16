import React, { useCallback, useReducer } from "react";
import { Input } from "./input.components";
import { reducer } from "../../../utils/reducers/form-reducer";
import { InputValidation } from "../../../utils/actions/form-actions";
import { SubmitButton } from "../../../components/submit-button";

const initialState = {

    inputValidities: {
        email: false,
        password: false
    },

    formIsValid: false
};
export const SignInForm = props => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    return (
        <>
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
                title="Sign In"
                isEnabled={formState.formIsValid}
            />
        </>
    )
}