import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomView, ChatInput, ChatsBackground, SendIcon, SendImageIcon, SendMessageIcon, TakePictureIcon } from "../components/chat.styles";
import { useSelector } from "react-redux";
import { Text } from "react-native";
import { PageContainer } from "../../../components/page-container";
import { Bubble } from "../components/bubble";
import { createChat, sendTextMessage } from "../../../utils/actions/chat-actions";

const ChatScreen = props => {
    const [chatUsers, setChatUsers] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [errorBannerText, setErrorBannerText] = useState("");
    const [chatId, setChatId] = useState(props.route?.params?.chatId) // to check wether it's a new chat or not

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const storedChats = useSelector(state => state.chats.chatsData);
    const chatMessages = useSelector(state => state.messages.messagesData);


    const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData;
    console.log(JSON.stringify(chatMessages[chatId], 0, 2));

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

            await sendTextMessage(chatId, userData.userId, messageText)

        } catch (error) {
            console.log(error);
            setErrorBannerText("Message failed to send");
            setTimeout(() => {
                setErrorBannerText("");
            }, 5000)
        }
        setMessageText("");
    }, [messageText, chatId]);

    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}  >
            <ChatsBackground>
                <PageContainer style={{ alignItems: 'center' }} >

                    {
                        !chatId &&

                        <Bubble text="This a new chat. Say hi!" type="system" />
                    }

                    {
                        errorBannerText &&
                        <Bubble type="error" text={errorBannerText} />
                    }
                </PageContainer>
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

