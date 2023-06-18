import React, { useCallback, useReducer, useState } from "react";
import { Text } from "react-native";
import { InputValidation } from "../../../utils/actions/form-actions";
import { reducer } from "../../../utils/reducers/form-reducer";
import { Input } from "../../account/components/input.components";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { colors } from "../../../infratructure/theme/colors";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import { SubmitButton } from "../../../components/submit-button";
import { updatedSignedInUserData, userLogout } from "../../../utils/actions/auth-actions";
import { ActivityIndicator } from "react-native-paper";
import { updateLoggedInUserData } from "../../../../store/auth-slice";
import { SuccessMessageContainer } from "../components/settings.styles";
import { ProfileImage } from "../../../components/profile-image.component";



const SettingsScreen = () => {

    const [isLoading, setIsloading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState("");
    const dispatch = useDispatch();

    const userData = useSelector(state => state.auth.userData);

    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const email = userData.email;
    const about = userData.about;

    const initialState = {

        inputValues: {
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            about: about || ""
        },

        inputValidities: {
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            about: undefined
        },

        inputIsValidColor: {
            firstName: "grey",
            lastName: "grey",
            email: "grey",
            about: "grey"
        },

        formIsValid: false
    };

    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const saveHandler = async () => {
        const updatedValues = formState.inputValues

        try {
            setIsloading(true)
            await updatedSignedInUserData(userData.userId, updatedValues);
            dispatch(updateLoggedInUserData({ newData: updatedValues }))

            setShowSuccessMessage("Saved!");

            setTimeout(() => {
                setShowSuccessMessage("");
            }, 3000);

            setIsloading(false);

        } catch (error) {
            console.log(error);
            setIsloading(false)
        }
    }

    const hasChanges = () => {
        const currentValues = formState.inputValues;

        return currentValues.firstName !== firstName ||
            currentValues.lastName !== lastName ||
            currentValues.email !== email ||
            currentValues.about !== about;
    };

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }} >

            <ProfileImage size={80} />

            <Input
                id="firstName"
                label="First name"
                labelColor={formState.inputIsValidColor["firstName"]}
                iconPack={Ionicons}
                icon={"ios-person"}
                iconColor={colors.primary}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["firstName"]}
                color={formState.inputIsValidColor["firstName"]}
                initialValue={userData.firstName}
            />

            <Input
                id="lastName"
                label="Last name"
                labelColor={formState.inputIsValidColor["lastName"]}
                iconPack={Ionicons}
                icon={"ios-person"}
                iconColor={colors.primary}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["lastName"]}
                color={formState.inputIsValidColor["lastName"]}
                initialValue={userData.lastName}
            />

            <Input
                id="email"
                label="Email"
                labelColor={formState.inputIsValidColor["email"]}
                iconPack={MaterialIcons}
                icon={"email"}
                iconColor={colors.primary}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["email"]}
                keyboardType="email-address"
                color={formState.inputIsValidColor["email"]}
                initialValue={userData.email}
            />

            <Input
                id="about"
                label="About"
                labelColor={formState.inputIsValidColor["about"]}
                iconPack={Entypo}
                icon={"lock"}
                iconColor={colors.primary}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["about"]}
                color={formState.inputIsValidColor["about"]}
                initialValue={userData.about}
            />

            {
                showSuccessMessage &&
                <SuccessMessageContainer >
                    <Text>{showSuccessMessage}</Text>
                </SuccessMessageContainer >
            }

            {
                isLoading ?
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} /> :
                    hasChanges() && <SubmitButton
                        title="Save"
                        disabled={!formState.formIsValid}
                        onPress={saveHandler}
                    />
            }

            <SubmitButton
                title="Log out"
                color={colors.error}
                onPress={() => dispatch(userLogout())}
            />
        </View>
    );
};

export default SettingsScreen;
