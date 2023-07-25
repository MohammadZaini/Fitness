import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAccount, userLogout } from "../../../utils/actions/auth-actions";
import { ProfileImage } from "../../../components/profile-image.component";
import { SafeAreaView } from "react-native-safe-area-context";
import { FadeInView } from "../../../components/animations/fade.animation";
import { Alert, ImageBackground } from "react-native";
import { List } from "react-native-paper";
import { styled } from "styled-components";

const SettingsScreen = props => {

    const userData = useSelector(state => state.auth.userData);
    const starredMessages = useSelector(state => state.messages.starredMessages ?? {});

    const dispatch = useDispatch();

    const sortedStarredMessages = useMemo(() => {
        let result = [];

        const chats = Object.values(starredMessages);

        chats.forEach(chat => {
            const chatMessages = Object.values(chat);
            result = result.concat(chatMessages);
        });

        return result;
    }, [starredMessages]);

    const logout = () => {
        Alert.alert("Log out",
            "Are you sure you want to log out?",
            [{ text: "Yes", onPress: dispatch(userLogout(userData, userData.userType)) },
            { text: "No", onPress: () => console.log("Don't log out") }]
        );
    };

    const deleteUserFromDb = () => {
        Alert.alert("Delete account",
            "Are you sure you want to delete your account?",
            [{ text: "Yes", onPress: () => console.log("Delete") },
            { text: "No", onPress: () => console.log("Don't Delete") }]
        );
    };

    return (
        <FadeInView duration={200}>
            <ImageBackground source={require("../../../../assets/images/splash.png")} style={{ height: "100%", width: "100%" }}>
                <SafeAreaView>

                    <ProfileImage
                        size={120}
                        userId={userData.userId}
                        uri={userData.profilePicture}
                        style={{ alignSelf: 'center', borderRadius: 60 }}
                    />

                    <List.Section>
                        <SettingsItem
                            title="Profile"
                            left={(props) => <List.Icon {...props} icon="account" />}
                            onPress={() => props.navigation.navigate("Profile")}
                        />
                        <SettingsItem
                            title="Starred messages"
                            left={(props) => <List.Icon {...props} icon="star" color="yellow" />}
                            onPress={() => props.navigation.navigate("DataList", {
                                title: "Starred messages",
                                data: sortedStarredMessages,
                                type: "messages",
                            })}
                        />
                        {/* <SettingsItem
                            title="Reset password"
                            left={(props) => <List.Icon {...props} icon="lock-reset" />}
                            onPress={() => props.navigation.navigate("Profile", { title: "Reset password" })}
                        />

                        <SettingsItem
                            title="About"
                            left={(props) => <List.Icon {...props} icon="information-outline" />}
                        /> */}

                        <SettingsItem
                            title="Log out"
                            left={(props) => <List.Icon {...props} icon="logout" />}
                            onPress={logout}
                        />
                        <SettingsItem
                            title="Delete accout"
                            titleStyle={{ color: "red" }}
                            left={(props) => <List.Icon {...props} icon="account-remove" />}
                            onPress={() => deleteUserFromDb()}

                        />
                    </List.Section>
                </SafeAreaView>
            </ImageBackground>
        </FadeInView>
    );
};

export default SettingsScreen;

export const SettingsItem = styled(List.Item)`
    padding: 16px;
    background-color: rgba(255, 255, 255, 0.5);
    margin-bottom: 7px
`