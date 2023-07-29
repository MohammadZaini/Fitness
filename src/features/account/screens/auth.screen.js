import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { SignUpForm } from "../components/sign-up-form.component";
import { SignInForm } from "../components/sign-in-form.component";
import { AccountAvailability, DumbbellImage, SafeArea } from "../components/auth.styles";

const AuthScreen = () => {
    const [isSigned, setIsSigned] = useState(false);
    return (
        <SafeArea>
            <DumbbellImage />

            {
                isSigned ? <SignUpForm /> : <SignInForm />
            }

            <TouchableOpacity onPress={() => setIsSigned(prevState => !prevState)} >
                <AccountAvailability>{isSigned ? "Aleady have an account? Sign in" : "Don't have an account yet? Sign up"}</AccountAvailability>
            </TouchableOpacity>

        </SafeArea>
    );
};

export default AuthScreen;

