export const reducer = (state, action) => {
    const { inputId, validationResult, inputValue } = action;

    const updatedValues = {
        ...state.inputValues,
        [inputId]: inputValue
    };

    const updatedValidites = {
        ...state.inputValidities,
        [inputId]: validationResult
    };

    let updatedFormIsValid = true;

    for (const key in updatedValidites) {
        if (updatedValidites[key] !== undefined) {
            updatedFormIsValid = false;
            break;
        };
    };

    return {
        inputValues: updatedValues,
        inputValidities: updatedValidites,
        formIsValid: updatedFormIsValid
    };
};