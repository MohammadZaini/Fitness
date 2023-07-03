import React, { useCallback, useEffect } from "react";
import { FlatList, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
import { useSelector } from "react-redux";
import { DataItem } from "../../../components/data-item.component";
import { PageContainer } from "../../../components/page-container";

const ChatListScreen = props => {

    const selectedUser = props.route?.params?.selectedUserId;
    const userData = useSelector(state => state.auth.userData);
    const userChats = useSelector(state => state.chats.chatsData);

    const sortedUserChat = useCallback(() => {
        return Object.values(userChats).sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt)
        })
    },[userChats])

    const storedUsers = useSelector(state => state.users.storedUsers);
console.log(storedUsers);
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                    <Item
                        title="new chat"
                        iconName="account-search-outline"
                        onPress={() => props.navigation.navigate("NewChat")}
                    />
                </HeaderButtons>
            }
        })
    }, []);

    useEffect(() => {
        if (!selectedUser) return;

        const chatUsers = [selectedUser, userData.userId];
        const navigationProps = {
            newChatData: { users: chatUsers }
        };

        props.navigation.navigate("Chat", navigationProps)
    }, [props.route?.params]);

    return (
        <PageContainer>
            <FlatList
                data={sortedUserChat()}
                showsVerticalScrollIndicator={false}
                keyExtractor={id => id.key}
                renderItem={(itemData) => {
                    const chatData = itemData.item;
                    const chatId = chatData.key;

                    const otherUserId = chatData.users.find(uid => uid !== userData.userId);
                    const otherUser = storedUsers[otherUserId];

                    if (!otherUserId) return;

                    const title = otherUser && `${otherUser.firstName} ${otherUser.lastName}`;
                    const subTitle = chatData.latestTextMessage || "New chat"
                    const image = otherUser &&  otherUser.profilePicture;

                    return <DataItem
                        uri={image}
                        title={title}
                        subTitle={subTitle}
                        onPress={() => props.navigation.navigate("Chat", { chatId })}
                        unOpenedMessages={subTitle}
                        personType={otherUser && otherUser.personType}
                        gender={otherUser && otherUser.gender}
                    />
                }}
            />
        </PageContainer>
    );
};

export default ChatListScreen;