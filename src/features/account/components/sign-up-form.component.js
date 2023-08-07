import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Input } from "./input.components";
import { InputValidation } from "../../../utils/actions/form-actions";
import { reducer } from "../../../utils/reducers/form-reducer";
import { SubmitButton } from "../../../components/submit-button";
import { SignUp } from "../../../utils/actions/auth-actions";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";
import { Alert, View } from "react-native";
import { useDispatch } from "react-redux";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import SwitchSelector from "react-native-switch-selector";
import { fonts } from "../../../infratructure/theme/fonts";

const initialState = {

    inputValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    },

    inputValidities: {
        firstName: false,
        lastName: false,
        email: false,
        password: false
    },

    inputIsValidColor: {
        firstName: "grey",
        lastName: "grey",
        email: "grey",
        password: "grey"
    },

    formIsValid: false
};

export const SignUpForm = props => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState("");
    const [userType, setuserType] = useState("trainee");
    const [gender, setGender] = useState("male");

    const dispatch = useDispatch();

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert("An error occured", error)
        };
    }, [error])

    const authHandler = useCallback(async () => {

        try {
            setIsloading(true);
            const action = SignUp(
                formState.inputValues.firstName,
                formState.inputValues.lastName,
                formState.inputValues.email,
                formState.inputValues.password,
                userType,
                gender
            );
            setError(null);
            await dispatch(action);
            setIsloading(false);
        } catch (error) {
            setError(error.message)
            console.log(error.message);
            setIsloading(false)
        }

    }, [dispatch, formState, userType, gender])

    const userTypeOptions = [
        {
            label: "Coach",
            value: "coach",
            imageIcon: require("../../../../assets/images/personal-trainer-icon.png")
        },
        {
            label: "Trainee",
            value: "trainee",
            imageIcon: require("../../../../assets/images/trainee-icon.png")
        }
    ];

    const genderOptions = [
        {
            label: "Male",
            value: "male",
            imageIcon: require("../../../../assets/images/male-icon.png")
        },
        {
            label: "Female",
            value: "female",
            imageIcon: require("../../../../assets/images/female-icon.png")
        }
    ];

    return (
        <>
            <Input
                id="firstName"
                label="First name"
                labelColor={formState.inputIsValidColor["firstName"]}
                iconPack={Ionicons}
                icon={"ios-person"}
                iconColor={formState.inputIsValidColor["firstName"]}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["firstName"]}
                color={formState.inputIsValidColor["firstName"]}
            />

            <Input
                id="lastName"
                label="Last name"
                labelColor={formState.inputIsValidColor["lastName"]}
                iconPack={Ionicons}
                icon={"ios-person"}
                iconColor={formState.inputIsValidColor["lastName"]}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["lastName"]}
                color={formState.inputIsValidColor["lastName"]}

            />

            <Input
                id="email"
                label="Email"
                labelColor={formState.inputIsValidColor["email"]}
                iconPack={MaterialIcons}
                icon={"email"}
                iconColor={formState.inputIsValidColor["email"]}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["email"]}
                keyboardType="email-address"
                color={formState.inputIsValidColor["email"]}

            />

            <Input
                id="password"
                label="Password"
                labelColor={formState.inputIsValidColor["password"]}
                iconPack={Entypo}
                icon={"lock"}
                iconColor={formState.inputIsValidColor["password"]}
                onInputChanged={onChangedHandler}
                autoCapitalize='none'
                autoCorrect={false}
                errorText={formState.inputValidities["password"]}
                secureTextEntry
                color={formState.inputIsValidColor["password"]}
            />

            <View style={{ flexDirection: 'row' }}>
                <SwitchSelector
                    options={userTypeOptions}
                    initial={1}
                    onPress={(value) => setuserType(value)}
                    style={{ marginTop: 10, width: 150, marginRight: 10 }}
                    buttonColor={colors.primary}
                    textStyle={{ fontFamily: fonts.body, flex: 1 }}
                    selectedTextStyle={{ fontFamily: fonts.body }}
                    imageStyle={{ height: 20, width: 20, marginRight: 8 }}
                />

                <SwitchSelector
                    options={genderOptions}
                    initial={0}
                    onPress={(value) => setGender(value)}
                    style={{ marginTop: 10, width: 150 }}
                    buttonColor={gender === "male" ? colors.primary : colors.female}
                    textStyle={{ fontFamily: fonts.body, flex: 1 }}
                    selectedTextStyle={{ fontFamily: fonts.body }}
                    imageStyle={{ height: 20, width: 20, marginRight: 8 }}
                />
            </View>
            {
                isLoading ?
                    <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} /> :
                    <SubmitButton
                        title="Sign up"
                        disabled={!formState.formIsValid}
                        onPress={authHandler}
                    />
            }
        </>
    );
};