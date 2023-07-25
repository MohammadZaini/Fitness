import { validateEmail, validateLength, validatePassword, validateString } from "../validation-constraints";

export const InputValidation = (id, value) => {
    switch (id) {
        case "firstName":
        case "lastName":
            return validateString(id, value);

        case "email":
            return validateEmail(id, value);

        case "password":
            return validatePassword(id, value);

        case "about":
            return validateLength(id, value, 0, 150, true);

        case "chatName":
            return validateLength(id, value, 5, 50, false);

        default:
            break;
    };
};