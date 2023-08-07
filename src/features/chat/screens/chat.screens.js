import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomView, ChatInput, ChatsBackground, HeaderContainer, HeaderImage, HeaderTitle, SendImageIcon, SendMessageIcon, TakePictureIcon } from "../components/chat.styles";
import { useSelector, shallowEqual } from "react-redux";
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
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from "react";
import { Text } from "react-native";

const ChatScreen = props => {
    const [chatUsers, setChatUsers] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [chatId, setChatId] = useState(props.route?.params?.chatId) // to check wether it's a new chat or not.
    const [errorBannerText, setErrorBannerText] = useState("");
    const [replyingTo, setReplyingTo] = useState("");
    const [tempImageUri, setTempImageUri] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const flatlistRef = useRef();

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const storedChats = useSelector(state => state.chats.chatsData);

    const chatMessages = useSelector(state => state.messages.messagesData, shallowEqual);

    const getCurrentChatMessages = (data) => {
        if (!chatId) return [];
        const chatMessagesData = data[chatId];

        if (!chatMessagesData) return [];

        const messageList = [];

        for (const key in chatMessagesData) {
            const message = chatMessagesData[key];

            messageList.push({
                key,
                ...message,
            });
        };

        return messageList;
    }

    const memoizedChatMessages = useMemo(() => {
        return getCurrentChatMessages(chatMessages);
    }, [chatMessages])

    const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData || {};

    const otherUserId = chatUsers.find(uid => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];
    const userType = otherUserData && otherUserData.userType

    const getChatTilteFromName = () => {
        return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;
    };

    useEffect(() => {
        if (!chatData) return;
        props.navigation.setOptions({
            headerTitle: () => (
                <HeaderContainer>
                    <HeaderImage
                        source={
                            chatData.chatImage || otherUserData && otherUserData.profilePicture ?
                                {
                                    uri: chatData.isGroupChat && chatData.chatImage ?
                                        chatData.chatImage :
                                        chatData.isGroupChat && !chatData.chatImage ?
                                            "https://i.ibb.co/HCqxzqY/user-Image.jpg" :
                                            otherUserData && otherUserData.profilePicture
                                }
                                : require("../../../../assets/images/userImage.jpeg")
                        }
                    />
                    <HeaderTitle>{chatData.chatName ?? getChatTilteFromName() ?? ""}</HeaderTitle>
                </HeaderContainer>
            ),
            headerTitleStyle: {
                marginLeft: 40,
            },
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    {
                        chatId &&
                        <Item
                            title="Chat settings"
                            iconPackge={Ionicons}
                            iconName="settings-outline"
                            onPress={() => {
                                chatData.isGroupChat ?
                                    props.navigation.navigate("ChatSettings", { chatId }) :
                                    props.navigation.navigate("Contact", { uid: chatUsers.find(uid => uid !== userData.userId), chatId })
                            }}
                        />
                    }
                </HeaderButtons>
            },
            // headerBackground: () => (
            //     <HeaderImage
            //         source={
            //             chatData.chatImage || otherUserData && otherUserData.profilePicture ?
            //                 {
            //                     uri: chatData.isGroupChat && chatData.chatImage ?
            //                         chatData.chatImage :
            //                         chatData.isGroupChat && !chatData.chatImage ?
            //                             "https://i.ibb.co/HCqxzqY/user-Image.jpg" :
            //                             otherUserData && otherUserData.profilePicture
            //                 }
            //                 : require("../../../../assets/images/userImage.jpeg")
            //         }
            //     />
            // ),
        });
        setChatUsers(chatData.users);
    }, [chatUsers]);

    const sendMessage = useCallback(async () => {
        try {
            let id = chatId;
            if (!id) {
                // create new chat
                console.log("Creating chat");
                id = await createChat(userData.userId, props.route.params.newChatData);
                setChatId(id)
            }
            console.log("Created");

            await sendTextMessage(id, userData, messageText, replyingTo && replyingTo.key, chatUsers, userType);
            setMessageText("");
            setReplyingTo(null);
        } catch (error) {
            console.log(error);
            setErrorBannerText("Message failed to send");
            setTimeout(() => {
                setErrorBannerText("");
            }, 5000)
        }

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

            await sendPhoto(id, userData, uploadUrl, replyingTo && replyingTo.key, chatUsers);
            setReplyingTo(null);
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
                        errorBannerText !== "" &&
                        <Bubble type="error" text={errorBannerText} />
                    }

                    {
                        chatId &&
                        <FlatList
                            ref={ref => flatlistRef.current = ref}
                            onContentSizeChange={() => memoizedChatMessages.length > 0 && flatlistRef.current.scrollToEnd({ animated: true })}
                            onLayout={() => memoizedChatMessages.length > 0 && flatlistRef.current.scrollToEnd({ animated: false })}
                            showsVerticalScrollIndicator={false}
                            data={memoizedChatMessages}
                            renderItem={(itemData) => {
                                const message = itemData.item;
                                const isOwnMessage = message.sentBy === userData.userId;
                                const sender = message.sentBy && storedUsers[message.sentBy];
                                const name = sender && `${sender.firstName} ${sender.lastName}`;
                                const profilePicture = sender && sender.profilePicture;

                                let messageType;

                                if (message.type && message.type === "info") {
                                    messageType = "info";
                                } else if (isOwnMessage) {
                                    messageType = "myMessage";
                                } else {
                                    messageType = "theirMessage";
                                };

                                return <Bubble
                                    text={message.text}
                                    type={messageType}
                                    date={message.sentAt}
                                    name={!chatData.isGroupChat || isOwnMessage ? undefined : name}
                                    userId={userData.userId}
                                    chatId={chatId}
                                    uri={profilePicture}
                                    messageId={message.key}
                                    setReply={() => setReplyingTo(message)}
                                    replyingTo={message.replyTo && memoizedChatMessages.find(i => i.key === message.replyTo)}
                                    imageUrl={message.imageUrl}
                                    isGroupChat={chatData.isGroupChat}
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