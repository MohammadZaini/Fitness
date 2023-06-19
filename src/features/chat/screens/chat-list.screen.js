import React, { useEffect } from "react";
import { FlatList, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
import { useSelector } from "react-redux";

const ChatListScreen = props => {

    const selcetedUser = props.route?.params?.selcetedUserId;
    const userData = useSelector(state => state.auth.userData);
    const userChats = useSelector(state => {
        const chatsData = state.chats.chatsData;
        return Object.values(chatsData); // chat data
    });
    const storedUsers = useSelector(state => state.users.storedUsers);

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
        <FlatList
            data={userChats}
            renderItem={(itemData) => {
                const chatData = itemData.item;
                const otherUserId = chatData.users.find(uid => uid !== userData.userId);
                const storedUserData = storedUsers[otherUserId]
                console.log(otherUserId);
                // console.log(JSON.stringify(chatData, 0, 2));
                return <Text>{storedUserData.firstName}</Text>
            }}
        />
    );
};

export default ChatListScreen;