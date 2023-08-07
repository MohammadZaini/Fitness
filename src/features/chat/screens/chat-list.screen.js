import React, { useCallback, useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
import { useSelector } from "react-redux";
import { DataItem } from "../../../components/data-item.component";
import { PageContainer } from "../../../components/page-container";
import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";

const ChatListScreen = props => {

    const selectedUser = props.route?.params?.selectedUserId;
    const selectedUserList = props.route?.params?.selectedUsers;
    const chatName = props.route?.params?.chatName;

    const userData = useSelector(state => state.auth.userData);
    const userChats = useSelector(state => state.chats.chatsData);

    const sortedUserChat = useCallback(() => {
        return Object.values(userChats).sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
    }, [userChats]);

    const storedUsers = useSelector(state => state.users.storedUsers);

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
        if (!selectedUser && !selectedUserList) return;

        let chatData;
        let naviagtionProps;

        if (selectedUser) {
            chatData = sortedUserChat().find(cd => !cd.isGroupChat && cd.users.includes(selectedUser))
        };

        if (chatData) {
            naviagtionProps = { chatId: chatData.key };
        } else {
            const chatUsers = selectedUserList || [selectedUser];

            if (!chatUsers.includes(userData.userId)) {
                chatUsers.push(userData.userId)
            }

            naviagtionProps = {
                newChatData: {
                    users: chatUsers,
                    isGroupChat: selectedUserList !== undefined,
                    // chatName
                }
            };

            if (chatName) {
                naviagtionProps.newChatData.chatName = chatName;
            };
        };

        props.navigation.navigate("Chat", naviagtionProps);

    }, [props.route?.params]);

    return (
        <PageContainer>
            {
                userData.userType === "coach" &&
                <View>
                    <TouchableOpacity onPress={() => props.navigation.navigate("NewChat", { isGroupChat: true })}>
                        <NewGroupText>New Group</NewGroupText>
                    </TouchableOpacity>
                </View>
            }
            <FlatList
                data={sortedUserChat()}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.key}
                renderItem={(itemData) => {
                    const chatData = itemData.item;
                    const chatId = chatData.key;
                    const isGroupChat = chatData.isGroupChat;

                    let title = "";
                    const subTitle = chatData.latestTextMessage || "New chat";
                    let image = "";
                    let userType = "";
                    let gender = "";

                    if (isGroupChat) {
                        title = chatData.chatName;
                        image = chatData.chatImage;

                    } else {
                        const otherUserId = chatData.users.find(uid => uid !== userData.userId);
                        const otherUser = storedUsers[otherUserId];
                        if (!otherUserId) return;

                        title = otherUser && `${otherUser.firstName} ${otherUser.lastName}`;
                        image = otherUser && otherUser.profilePicture;
                        userType = otherUser && otherUser.userType;
                        gender = otherUser && otherUser.gender;
                    }

                    return <DataItem
                        uri={image}
                        title={title}
                        subTitle={subTitle}
                        onPress={() => props.navigation.navigate("Chat", { chatId })}
                        unOpenedMessages={subTitle}
                        userType={isGroupChat ? "" : userType && userType}
                        gender={isGroupChat ? "" : gender && gender}
                    />
                }}
            />
        </PageContainer>
    );
};

export default ChatListScreen;


const NewGroupText = styled.Text`
    color: ${colors.primary};
    font-size: 17px;
    margin-vertical: 5px;
`;