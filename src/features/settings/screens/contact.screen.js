import { View, Text } from 'react-native'
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

const ContactScreen = props => {
    const storedUsers = useSelector(state => state.users.storedUsers);
    const currentUser = storedUsers[props.route.params.uid];

    const storedChats = useSelector(state => state.chats.chatsData);
    const [commonChats, setCommonChats] = useState([]);

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
    console.log(commonChats);
    return (
        <PageContainer>
            <Container>
                <ProfileImage
                    uri={currentUser.profilePicture}
                    size={80}
                    style={{ marginBottom: 15 }}
                />

                <CurrentUserName>{`${currentUser.firstName} ${currentUser.lastName}`}</CurrentUserName>
                {
                    currentUser.about &&
                    <About>{currentUser.about}</About>
                }

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
                </>
            }
        </PageContainer>
    )
}

export default ContactScreen;

const Container = styled.View`
    justify-content: center;
    align-items: center;
`;

const CurrentUserName = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const About = styled.Text.attrs(() => {
    numberOfLines = 2;
})`
    font-size: 15px;
    color: ${colors.lightGrey}
`;
