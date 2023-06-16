import { validateEmail, validateLength, validateString } from "../validation-constraints";

export const InputValidation = (id, value) => {
    switch (id) {
        case "firstName":
        case "lastName":
            return validateString(id, value);

        case "email":
            return validateEmail(id, value);

        case "password":
            return validateLength(id, value);

        default:
            break;
    }
}