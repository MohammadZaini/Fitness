import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomView, ChatInput, ChatsBackground, SendIcon, SendImageIcon, SendMessageIcon, TakePictureIcon } from "../components/chat.styles";
import { useSelector } from "react-redux";
import { PageContainer } from "../../../components/page-container";
import { Bubble } from "../components/bubble";
import { createChat, sendTextMessage } from "../../../utils/actions/chat-actions";
import { FlatList } from "react-native";
import { ReplyTo } from "../components/reply-to.component";

const ChatScreen = props => {
    const [chatUsers, setChatUsers] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [errorBannerText, setErrorBannerText] = useState("");
    const [chatId, setChatId] = useState(props.route?.params?.chatId) // to check wether it's a new chat or not
    const [replyingTo, setReplyingTo] = useState("");

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const storedChats = useSelector(state => state.chats.chatsData);

    const chatMessages = useSelector(state => state.messages.messagesData);

    const chatMessagesList = useCallback(() => {
        if (!chatId) return [];

        const chatMessagesData = chatMessages[chatId];

        if (!chatMessagesData) return [];

        const messageList = [];

        for (const key in chatMessagesData) {
            const message = chatMessagesData[key]

            messageList.push({
                key,
                ...message,
            })
        }

        return messageList;
    }, [chatId])


    const flatRef = useRef();


    const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData;

    const getChatTilteFromName = () => {
        const otherUserId = chatUsers.find(uid => uid !== userData.userId);
        const otherUserData = storedUsers[otherUserId];
        return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;
    };

    useEffect(() => {

        props.navigation.setOptions({
            headerTitle: getChatTilteFromName()
        });
        setChatUsers(chatData.users);
    }, [chatUsers]);

    const sendMessage = useCallback(async () => {

        try {
            let id = chatId
            if (!id) {
                // create new chat
                id = await createChat(userData.userId, props.route.params.newChatData);
                setChatId(id)
            }

            await sendTextMessage(chatId, userData.userId, messageText, replyingTo && replyingTo.key)

        } catch (error) {
            console.log(error);
            setErrorBannerText("Message failed to send");
            setTimeout(() => {
                setErrorBannerText("");
            }, 5000)
        }
        setMessageText("");
        setReplyingTo(null);
    }, [messageText, chatId]);

    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}  >
            <ChatsBackground>
                <PageContainer  >

                    {
                        !chatId &&

                        <Bubble text="This a new chat. Say hi!" type="system" />
                    }

                    {
                        errorBannerText &&
                        <Bubble type="error" text={errorBannerText} />
                    }

                    {
                        chatId &&
                        <FlatList
                            ref={ref => flatRef.current = ref}
                            onContentSizeChange={() => chatMessages.length > 0 && flatRef.current.scrollToEnd({ animated: true })}
                            showsVerticalScrollIndicator={false}
                            data={chatMessagesList()}
                            // keyExtractor={(id, index) => id.key + index.toString()}
                            renderItem={(itemData) => {
                                const message = itemData.item;
                                const isOwnMessage = message.sentBy === userData.userId;
                                // console.log(JSON.stringify(chatMessages, 0, 2));
                                const messageType = isOwnMessage ? "myMessage" : "theirMessage";
                                return <Bubble
                                    text={message.text}
                                    type={messageType}
                                    date={message.sentAt}
                                    userId={userData.userId}
                                    chatId={chatId}
                                    messageId={message.key}
                                    setReply={() => setReplyingTo(message)}
                                    replyingTo={message.replyTo && chatMessagesList().find(i => i.key === message.replyTo)}
                                />
                            }}
                        />
                    }
                </PageContainer>

                {
                    replyingTo &&
                    <ReplyTo
                        text={replyingTo.text}
                        user={storedUsers[replyingTo.sentBy]}
                        onCancel={() => setReplyingTo(null)}
                    />
                }
            </ChatsBackground>

            <BottomView >
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} >
                    <SendImageIcon />
                </TouchableOpacity>

                <ChatInput value={messageText} onChangeText={setMessageText} />

                {
                    messageText ?
                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={sendMessage}>
                            <SendMessageIcon />
                        </TouchableOpacity> :

                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <TakePictureIcon />
                        </TouchableOpacity>
                }

            </BottomView>
        </SafeAreaView>
    );
};

export default ChatScreen;

