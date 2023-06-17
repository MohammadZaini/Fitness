import { colors } from "../../infratructure/theme/colors";

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
    let updatedInputIsValidColor = {};

    for (const key in updatedValidites) {
        if (updatedValidites[key] !== undefined) {
            updatedFormIsValid = false;
            break;
        };
    };

    for (const key in updatedValidites) {
        if (updatedValidites[key] !== undefined || updatedValidites[key] === false) { // "firstName": ahmad
            if (updatedValidites[key] === false) {
                updatedInputIsValidColor[key] = "grey"
            } else {
                updatedInputIsValidColor[key] = colors.error
            }

        } else {
            updatedInputIsValidColor[key] = colors.primary
        }
    };

    return {
        inputValues: updatedValues,
        inputValidities: updatedValidites,
        formIsValid: updatedFormIsValid,
        inputIsValidColor: updatedInputIsValidColor
    };
};