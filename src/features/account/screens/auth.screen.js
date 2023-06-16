import React, { useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { SignUpForm } from "../components/sign-up-form.component";
import { SignInForm } from "../components/sign-in-form.component";
import { colors } from "../../../infratructure/theme/colors";

const AuthScreen = props => {
    const [isSigned, setIsSigned] = useState(false);
    return (
        <View style={{ alignContent: 'center', alignItems: 'center' }} >
            <Image source={require("../../../../assets/images/dumbbell-gym.png")} style={{ height: 150, width: 200, marginVertical: 20 }} />

            {
                isSigned ? <SignInForm /> : <SignUpForm />
            }

            <TouchableOpacity onPress={() => setIsSigned(prevState => setIsSigned(!prevState))} >

                <Text style={{ color: colors.primary }} >{isSigned ? "Doesn't have an account yet? Sign up" : "Aleady have an account? Sign in"}</Text>
            </TouchableOpacity>

        </View>
    )
};

export default AuthScreen;