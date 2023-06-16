import validate from "validate.js"

export const validateString = (id, value) => {
    const constraints = {
        presence: { allowEmpty: false }
    }

    if (id !== "") {
        constraints.format = {
            pattern: "[a-z]+",
            flags: "i",
            message: "value can only contain letters"
        };
    };

    const validationResult = (validate({ [id]: value }, { [id]: constraints }));

    return validationResult && validationResult[id];
};

export const validateEmail = (id, value) => {
    const constraints = {
        presence: { allowEmpty: false }
    }

    if (id !== "") {
        constraints.email = true
    };

    const validationResult = (validate({ [id]: value }, { [id]: constraints }));

    return validationResult && validationResult[id];
};

export const validateLength = (id, value) => {
    const constraints = {
        presence: { allowEmpty: false }
    }

    if (id !== "") {
        constraints.length = {
            minimum: 6,
            message: "should at least 6 characters"
        };
    };

    const validationResult = (validate({ [id]: value }, { [id]: constraints }));

    return validationResult && validationResult[id];
};