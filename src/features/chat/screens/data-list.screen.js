import React from 'react'
import { useEffect } from 'react';
import { View, Text } from 'react-native'
import { PageContainer } from '../../../components/page-container';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { DataItem } from '../../../components/data-item.component';
import { Bubble } from '../components/bubble';

const DataListScreen = props => {

    const { title, data, type, chatId } = props.route.params;
    const storedUsers = useSelector(state => state.users.storedUsers);
    const userData = useSelector(state => state.auth.userData);
    const messagesData = useSelector(state => state.messages.messagesData);

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: title
        })
    }, [title]);

    return (
        <PageContainer>
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.messageId || item}
                renderItem={itemData => {
                    let key, onPress, image, title, subTitle, itemType, data, type2;

                    if (type === "users") {
                        const uid = itemData.item;
                        const currentUser = storedUsers[uid];

                        if (!currentUser) return;

                        const isLoggedInUser = uid === userData.userId;

                        key = uid;
                        image = currentUser.profilePicture;
                        title = isLoggedInUser ? "You" : `${currentUser.firstName} ${currentUser.lastName}`;
                        subTitle = currentUser.about;
                        itemType = isLoggedInUser ? undefined : "link";
                        onPress = isLoggedInUser ? undefined : () => props.navigation.navigate("Contact", { uid, chatId });

                    } else if (type === "messages") {
                        const starData = itemData.item;
                        const { chatId, messageId } = starData;

                        const messagesForChat = messagesData[chatId];

                        if (!messagesForChat) return;

                        const messageData = messagesForChat[messageId];

                        const sender = messageData && storedUsers[messageData.sentBy];
                        let name = sender && `${sender.firstName} ${sender.lastName}`;

                        if (name === `${userData.firstName} ${userData.lastName}`) {
                            name = "You"
                        }
                        key = messageId;
                        image = sender && sender.profilePicture
                        title = name;
                        subTitle = messageData && messageData.text;
                        data = messageData && messageData.sentAt
                        type2 = sender && sender.userId === userData.userId ? "myStarredMessages" : "thierStarredMessages"
                        itemType = "";
                        onPress = () => { };
                    };

                    if (type === "users") {
                        return <DataItem
                            key={key}
                            onPress={onPress}
                            uri={image}
                            title={title}
                            subTitle={subTitle}
                            type={itemType}
                            hideImage={type === "users" ? false : true}
                        />
                    } else {
                        return <Bubble
                            text={subTitle}
                            type={type2}
                            date={data}
                            name={title}
                            messageId={key}
                            // setReply={() => setReplyingTo(message)}
                            // replyingTo={message.replyTo && chatMessages.find(i => i.key === message.replyTo)}
                            uri={image}
                        // isGroupChat={chatData.isGroupChat}
                        />
                    }


                }}
            />
        </PageContainer>
    )
}

export default DataListScreen