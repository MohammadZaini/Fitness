import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { getFirebaseApp } from "../firebase-helper";
import { getUserPushTokens } from "./auth-actions";

export const createChat = async (loggedInUserId, chatData) => {

    const newChatData = {
        ...chatData,
        createdBy: loggedInUserId,
        updatedBy: loggedInUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));

    const newChat = await push(child(dbRef, "chats"), newChatData);

    const chatUsers = newChatData.users;
    for (let i = 0; i < chatUsers.length; i++) {
        const userId = chatUsers[i];
        await push(child(dbRef, `userChats/${userId}`), newChat.key);
    };

    return newChat.key;
};

export const sendTextMessage = async (chatId, senderData, messageText, replyTo, chatUsers, otherUserType) => {
    await sendMessage(chatId, senderData.userId, messageText, null, replyTo);

    const otherUsers = chatUsers.filter(uid => uid !== senderData.userId)
    console.log(otherUserType);
    await sendPushNotificationForUsers(otherUsers, `${senderData.firstName} ${senderData.lastName}`, messageText, chatId, otherUserType);
};

export const sendPhoto = async (chatId, senderData, imageUrl, replyTo, chatUsers, otherUserType) => {
    await sendMessage(chatId, senderData.userId, "Photo", imageUrl, replyTo, null);

    const otherUsers = chatUsers.filter(uid => uid !== senderData.userId)
    await sendPushNotificationForUsers(otherUsers, `${senderData.firstName} ${senderData.lastName}`, `${senderData.firstName} sent a photo`, chatId, otherUserType);
};

const sendMessage = async (chatId, senderId, messageText, imageUrl, replyTo) => {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const messagesRef = child(dbRef, `messages/${chatId}`);

    const messageData = {
        sentBy: senderId,
        sentAt: new Date().toISOString(),
        text: messageText
    };

    if (replyTo) {
        messageData.replyTo = replyTo;
    };

    if (imageUrl) {
        messageData.imageUrl = imageUrl;
    };

    await push(messagesRef, messageData);

    const chatRef = child(dbRef, `chats/${chatId}`);

    await update(chatRef, {
        updatedBy: senderId,
        updatedAt: new Date().toISOString(),
        latestTextMessage: messageText
    });
}

export const starMessage = async (userId, chatId, messageId) => {

    try {

        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const childRef = child(dbRef, `starredMessages/${userId}/${chatId}/${messageId}`);

        const snapshot = await get(childRef);

        if (snapshot.exists()) {
            console.log("Unstaring");
            await remove(childRef)
        } else {
            console.log("Staring");

            const starredMessagesData = {
                messageId,
                chatId,
                starredAt: new Date().toISOString()
            };

            await set(childRef, starredMessagesData)
        }
    } catch (error) {
        console.log(error);
    };
};

const sendPushNotificationForUsers = (chatUsers, title, body, chatId, userType) => {
    chatUsers.forEach(async uid => {
        console.log("test");
        const tokens = await getUserPushTokens(uid, userType);

        for (const key in tokens) {
            const token = tokens[key];

            await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: token,
                    title,
                    body,
                    data: { chatId }
                })
            })
        }
    })
}