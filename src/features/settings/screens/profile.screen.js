import { View, Text } from 'react-native'
import React from 'react'
import { updatedSignedInUserData, userLogout } from '../../../utils/actions/auth-actions';
import { SubmitButton } from '../../../components/submit-button';
import { ActivityIndicator } from 'react-native-paper';
import { SuccessMessageContainer } from '../components/settings.styles';
import { Input } from '../../account/components/input.components';
import { ProfileImage } from '../../../components/profile-image.component';
import { ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { updateLoggedInUserData } from '../../../../store/auth-slice';
import { useCallback } from 'react';
import { InputValidation } from '../../../utils/actions/form-actions';
import { useReducer } from 'react';
import { reducer } from '../../../utils/reducers/form-reducer';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { colors } from '../../../infratructure/theme/colors';
import { FadeInView } from '../../../components/animations/fade.animation';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';

const ProfileScreen = props => {

    const [isLoading, setIsloading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState("");
    const dispatch = useDispatch();

    const userData = useSelector(state => state.auth.userData);

    const title = props.route.params && props.route.params.title;

    const firstName = userData.firstName || "";
    const lastName = userData.lastName || "";
    const email = userData.email || "";
    const about = userData.about || "";

    const initialState = {

        inputValues: {
            firstName,
            lastName,
            email,
            about
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

    useEffect(() => {
        props.navigation.setOptions({
            headerShown: title ? true : false,
            headerTitle: title ? title : "",
        })
    }, []);

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const saveHandler = useCallback(async () => {
        const updatedValues = formState.inputValues

        try {
            setIsloading(true)
            await updatedSignedInUserData(userData.userId, updatedValues);
            dispatch(updateLoggedInUserData({ newData: updatedValues }));

            setShowSuccessMessage("Saved!");

            setTimeout(() => {
                setShowSuccessMessage("");
            }, 3000);

            setIsloading(false);

        } catch (error) {
            console.log(error);
            setIsloading(false)
        };
    }, [formState]);

    const hasChanges = () => {
        const currentValues = formState.inputValues;

        return currentValues.firstName !== firstName ||
            currentValues.lastName !== lastName ||
            currentValues.email !== email ||
            currentValues.about !== about;
    };

    return (
        <FadeInView duration={200}>
            <SafeAreaView >
                <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} >

                    {
                        !title &&
                        <>
                            <ProfileImage
                                size={80}
                                userId={userData.userId}
                                uri={userData.profilePicture}
                                showEditButton={true}
                            />

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
                                editable={false}
                            />

                            <Input
                                id="about"
                                label="About"
                                labelColor={formState.inputIsValidColor["about"]}
                                iconPack={Feather}
                                icon={"info"}
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
                        </>
                    }

                </ScrollView>

            </SafeAreaView>
        </FadeInView>
    )
}

export default ProfileScreen