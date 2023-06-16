export const reducer = (state, action) => {
    const { inputId, validationResult, inputValue } = action;

    const updatedValidites = {
        ...state.inputValidities,
        [inputId]: validationResult
    }

    let updatedFormIsValid = true;

    for (const key in updatedValidites) {
        if (updatedValidites[key] !== undefined) {
            updatedFormIsValid = false;
            break;
        }
    }


    return {
        inputValidities: updatedValidites,
        formIsValid: updatedFormIsValid
    };
};