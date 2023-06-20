import React, { useEffect } from "react";
import { FlatList, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
import { useSelector } from "react-redux";
import { DataItem } from "../../../components/data-item.component";
import { PageContainer } from "../../../components/page-container";

const ChatListScreen = props => {

    const selcetedUser = props.route?.params?.selcetedUserId;
    const userData = useSelector(state => state.auth.userData);
    const userChats = useSelector(state => {
        const chatsData = state.chats.chatsData;

        // chat data
        return Object.values(chatsData).sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt)
        })
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
        <PageContainer>
            <FlatList
                data={userChats}
                keyExtractor={id => id.key}
                renderItem={(itemData) => {
                    const chatData = itemData.item;
                    const chatId = chatData.key;

                    const otherUserId = chatData.users.find(uid => uid !== userData.userId);
                    const otherUser = storedUsers[otherUserId];

                    const title = `${otherUser.firstName} ${otherUser.lastName}`;
                    const subTitle = chatData.latestTextMessage || "New chat"
                    const image = otherUser.profilePicture;

                    if (!otherUserId) return;

                    return <DataItem
                        uri={image}
                        title={title}
                        subTitle={subTitle}
                        onPress={() => props.navigation.navigate("Chat", { chatId })}
                        unOpenedMessages={subTitle}
                    />
                }}
            />
        </PageContainer>
    );
};

export default ChatListScreen;