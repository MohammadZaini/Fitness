import { Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { PageContainer } from '../../../components/page-container';
import { ProfileImage } from '../../../components/profile-image.component';
import { styled } from 'styled-components';
import { colors } from '../../../infratructure/theme/colors';
import { useEffect } from 'react';
import { getUserChats } from '../../../utils/actions/user-actions';
import { useState } from 'react';
import { DataItem } from '../../../components/data-item.component';
import { SubmitButton } from '../../../components/submit-button';
import { ActivityIndicator } from 'react-native-paper';
import { removeUserFromChat } from '../../../utils/actions/chat-actions';
import { useCallback } from 'react';
import { About, Container, CurrentUserName } from '../components/contact.styles';

const ContactScreen = props => {
    const [isLoading, setIsLoading] = useState(false);

    const storedUsers = useSelector(state => state.users.storedUsers);
    const currentUser = storedUsers[props.route.params.uid];

    const storedChats = useSelector(state => state.chats.chatsData);
    const userData = useSelector(state => state.auth.userData);
    const [commonChats, setCommonChats] = useState([]);

    const chatId = props.route.params.chatId;
    const chatData = chatId && storedChats[chatId];
    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});

    useEffect(() => {
        const getCommonUserChats = async () => {

            try {
                const currentUserChats = await getUserChats(currentUser.userId);
                setCommonChats(
                    Object.values(currentUserChats).filter(cid => storedChats[cid] && storedChats[cid].isGroupChat)
                )
            } catch (error) {
                console.log(error);
            }
        };
        getCommonUserChats();

    }, []);

    const removeFromChat = useCallback(async () => {
        try {
            setIsLoading(true);

            await removeUserFromChat(userData, currentUser, chatData)
            props.navigation.goBack();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [props.navigation, isLoading]);
    console.log(starredMessages);
    return (
        <PageContainer>
            <Container>
                <ProfileImage
                    uri={currentUser && currentUser.profilePicture}
                    size={80}
                    style={{ marginBottom: 15 }}
                />

                <CurrentUserName>{currentUser && `${currentUser.firstName} ${currentUser.lastName}`}</CurrentUserName>
                {
                    currentUser && currentUser.about &&

                    <About>{currentUser && currentUser.about}</About>
                }

                <DataItem
                    userType={currentUser && currentUser.userType}
                    gender={currentUser && currentUser.gender}
                    hideImage={true}
                    isContactScreen={true}
                />

            </Container>

            {
                commonChats.length > 0 &&
                <>
                    <Text style={{ marginVertical: 10 }}>{commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"} in Common</Text>

                    {
                        commonChats.map(cid => {
                            const chatData = storedChats[cid];

                            return (
                                <DataItem
                                    key={cid}
                                    title={chatData.chatName}
                                    subTitle={chatData.latestTextMessage}
                                    type="link"
                                    onPress={() => props.navigation.push("Chat", { chatId: cid })}
                                    uri={chatData.chatImage}
                                />
                            )
                        })
                    }

                    {
                        starredMessages &&
                        <DataItem
                            title="Starred messages"
                            type="link"
                            hideImage={true}
                            onPress={() => props.navigation.navigate("DataList", {
                                title: "Starred messages",
                                data: Object.values(starredMessages),
                                type: "messages",
                            })}
                        />
                    }

                    {

                        chatData && chatData.isGroupChat &&

                        (
                            isLoading ?
                                <ActivityIndicator size="small" color={colors.red} />
                                :
                                userData.userType === "coach" &&
                                <SubmitButton
                                    title="Remove from chat"
                                    color={colors.red}
                                    style={{ marginHorizontal: 40, }}
                                    onPress={removeFromChat}
                                />
                        )
                    }
                </>
            }

        </PageContainer>
    )
};

export default ContactScreen;


