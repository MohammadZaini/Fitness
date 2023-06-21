import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomView, ChatInput, ChatsBackground, SendIcon, SendImageIcon, SendMessageIcon, TakePictureIcon } from "../components/chat.styles";
import { useSelector } from "react-redux";
import { PageContainer } from "../../../components/page-container";
import { Bubble } from "../components/bubble";
import { createChat, sendPhoto, sendTextMessage } from "../../../utils/actions/chat-actions";
import { FlatList } from "react-native";
import { ReplyTo } from "../components/reply-to.component";
import AwesomeAlert from "react-native-awesome-alerts";
import { colors } from "../../../infratructure/theme/colors";
import { launchImagePicker, openCamera, uploadImageAsync } from "../../../utils/image-picker-helper";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { fonts } from "../../../infratructure/theme/fonts";

const ChatScreen = props => {
    const [chatUsers, setChatUsers] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [errorBannerText, setErrorBannerText] = useState("");
    const [chatId, setChatId] = useState(props.route?.params?.chatId) // to check wether it's a new chat or not
    const [replyingTo, setReplyingTo] = useState("");
    const [tempImageUri, setTempImageUri] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const storedChats = useSelector(state => state.chats.chatsData);

    const chatMessages = useSelector(state => {
        // state.messages.messagesData
        if (!chatId) return [];

        const chatMessagesData = state.messages.messagesData[chatId];

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
    })


    // const chatMessagesList = useCallback(() => {
    //     if (!chatId) return [];

    //     const chatMessagesData = chatMessages[chatId];

    //     if (!chatMessagesData) return [];

    //     const messageList = [];

    //     for (const key in chatMessagesData) {
    //         const message = chatMessagesData[key]

    //         messageList.push({
    //             key,
    //             ...message,
    //         })
    //     }

    //     return messageList;
    // }, [chatId])


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
                console.log("Creating chat");
                id = await createChat(userData.userId, props.route.params.newChatData);
                setChatId(id)
            }
            console.log("Created");

            await sendTextMessage(id, userData.userId, messageText, replyingTo && replyingTo.key);

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

    const pickPhoto = useCallback(async () => {
        try {
            const tempUri = await launchImagePicker();
            if (!tempUri) return;

            setTempImageUri(tempUri)

        } catch (error) {
            console.log(error);
        }
    }, [tempImageUri]);

    const takePhoto = useCallback(async () => {
        try {
            const tempUri = await openCamera();
            if (!tempUri) return;

            setTempImageUri(tempUri)

        } catch (error) {
            console.log(error);
        }
    }, [tempImageUri]);

    const uploadphoto = useCallback(async () => {
        setIsLoading(true);

        let id = chatId
        if (!id) {
            // create new chat
            id = await createChat(userData.userId, props.route.params.newChatData);
            setChatId(id)
        }

        try {
            const uploadUrl = await uploadImageAsync(tempImageUri, true);
            setIsLoading(false);

            await sendPhoto(id, userData.userId, uploadUrl, replyingTo && replyingTo.key)
            setTimeout(() => setTempImageUri(""), 500);


            setTempImageUri("");
        } catch (error) {
            console.log(error);
            setIsLoading(false);

        }
    }, [isLoading, tempImageUri, chatId]);

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
                            onContentSizeChange={() => chatMessages.length > 0 && flatRef.current.scrollToEnd({ animated: false })}
                            showsVerticalScrollIndicator={false}
                            data={chatMessages}
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
                                    replyingTo={message.replyTo && chatMessages.find(i => i.key === message.replyTo)}
                                    imageUrl={message.imageUrl}
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
                    <SendImageIcon onPress={pickPhoto} />
                </TouchableOpacity>

                <ChatInput value={messageText} onChangeText={setMessageText} />

                {
                    messageText ?
                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={sendMessage}>
                            <SendMessageIcon />
                        </TouchableOpacity> :

                        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <TakePictureIcon onPress={takePhoto} />
                        </TouchableOpacity>
                }

                <AwesomeAlert
                    contentContainerStyle={styles.container}
                    show={tempImageUri !== ""}
                    title="Send photo"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    showCancelButton={true}
                    showConfirmButton={true}
                    confirmButtonColor={colors.primary}
                    cancelButtonColor={colors.red}
                    cancelText="Cancel"
                    confirmText="Send photo"
                    confirmButtonTextStyle={styles.text}
                    cancelButtonTextStyle={styles.text}
                    titleStyle={styles.text}
                    onCancelPressed={() => setTempImageUri("")}
                    onConfirmPressed={uploadphoto}
                    onDismiss={() => setTempImageUri("")}
                    customView={(
                        <View>

                            {
                                isLoading &&
                                <View>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                </View>
                            }
                            {
                                !isLoading && tempImageUri !== "" &&
                                <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200 }} />
                            }
                        </View>
                    )}
                />

            </BottomView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.lightBlue,
        borderRadius: 20
    },
    text: {
        fontFamily: fonts.body
    }
});

export default ChatScreen;

