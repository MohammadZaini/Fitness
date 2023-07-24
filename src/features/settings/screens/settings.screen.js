import React, { useCallback, useReducer, useState } from "react";
import { ScrollView, Text } from "react-native";
import { InputValidation } from "../../../utils/actions/form-actions";
import { reducer } from "../../../utils/reducers/form-reducer";
import { Input } from "../../account/components/input.components";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { colors } from "../../../infratructure/theme/colors";
import { useDispatch, useSelector } from "react-redux";
import { SubmitButton } from "../../../components/submit-button";
import { updatedSignedInUserData, userLogout } from "../../../utils/actions/auth-actions";
import { ActivityIndicator } from "react-native-paper";
import { updateLoggedInUserData } from "../../../../store/auth-slice";
import { SuccessMessageContainer } from "../components/settings.styles";
import { ProfileImage } from "../../../components/profile-image.component";
import { SafeAreaView } from "react-native-safe-area-context";
import { FadeInView } from "../../../components/animations/fade.animation";
import { ImageBackground } from "react-native";
import { List } from "react-native-paper";
import { styled } from "styled-components";
import { DataItem } from "../../../components/data-item.component";
import { useMemo } from "react";

const SettingsScreen = props => {

    const userData = useSelector(state => state.auth.userData);
    const starredMessages = useSelector(state => state.messages.starredMessages ?? {});

    const sortedStarredMessages = useMemo(() => {
        let result = [];

        const chats = Object.values(starredMessages);

        chats.forEach(chat => {
            const chatMessages = Object.values(chat);
            result = result.concat(chatMessages);
        });

        return result;
    }, [starredMessages]);

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
                        <SettingsItem
                            title="Reset password"
                            left={(props) => <List.Icon {...props} icon="lock-reset" />}
                        />

                        <SettingsItem
                            title="About"
                            left={(props) => <List.Icon {...props} icon="information-outline" />}
                        />

                        <SettingsItem
                            title="Log out"
                            left={(props) => <List.Icon {...props} icon="logout" />}
                        />
                        <SettingsItem
                            title="Delete accout"
                            titleStyle={{ color: "red" }}
                            left={(props) => <List.Icon {...props} icon="account-remove" />}
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