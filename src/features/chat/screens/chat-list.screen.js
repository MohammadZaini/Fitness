import React, { useEffect } from "react";
import { Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
import { useSelector } from "react-redux";

const ChatListScreen = props => {

    const selcetedUser = props.route?.params?.selcetedUserId
    const userData = useSelector(state => state.auth.userData)

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                    <Item
                        title="new chat"
                        iconName="create-outline"
                        onPress={() => props.navigation.navigate("NewChat")}
                    />
                </HeaderButtons>
            }
        })
    }, []);

    useEffect(() => {
        if (!selcetedUser) return;

        const chatUsers = [selcetedUser, userData.userId];
        const navigationProps = {
            newChatData: { users: chatUsers }
        };

        props.navigation.navigate("Chat", navigationProps)
    }, [props.route?.params]);

    return (
        <Text>ChatList Screen</Text>
    );
};

export default ChatListScreen;