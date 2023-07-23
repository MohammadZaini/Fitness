import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { getFirebaseApp } from "../firebase-helper";
import { getUserPushTokens } from "./auth-actions";
import { deleteUserChat, getUserChats } from "./user-actions";

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
    await sendMessage(chatId, senderData.userId, messageText, null, replyTo, null);

    const otherUsers = chatUsers.filter(uid => uid !== senderData.userId)
    console.log(otherUserType);
    await sendPushNotificationForUsers(otherUsers, `${senderData.firstName} ${senderData.lastName}`, messageText, chatId, otherUserType);
};

export const sendInfoMessage = async (chatId, senderId, messageText) => {
    await sendMessage(chatId, senderId, messageText, null, null, "info")
};

export const sendPhoto = async (chatId, senderData, imageUrl, replyTo, chatUsers, otherUserType) => {
    await sendMessage(chatId, senderData.userId, "Photo", imageUrl, replyTo, null);

    const otherUsers = chatUsers.filter(uid => uid !== senderData.userId)
    await sendPushNotificationForUsers(otherUsers, `${senderData.firstName} ${senderData.lastName}`, `${senderData.firstName} sent a photo`, chatId, otherUserType);
};

export const updateChatData = async (chatId, userId, chatData) => {

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `chats/${chatId}`);

    await update(chatRef, {
        ...chatData,
        updatedAt: new Date().toDateString(),
        updatedBy: userId
    });
};

const sendMessage = async (chatId, senderId, messageText, imageUrl, replyTo, type) => {
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

    if (type) {
        messageData.type = type;
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
};

export const deleteMessage = async (chatId, messageId) => {
    try {
        const app = getFirebaseApp();
        const dbRef = ref(getDatabase(app));
        const childRef = child(dbRef, `messages/${chatId}/${messageId}`);
        await remove(childRef)
    } catch (error) {
        console.log(error);
    };
};

export const removeUserFromChat = async (userLoggedInData, userToRemoveData, chatData) => {
    const userToRemoveId = userToRemoveData.userId;
    const newUsers = chatData.users.filter(uid => uid !== userToRemoveId);
    await updateChatData(chatData.key, userLoggedInData.userId, { users: newUsers });

    // We need to delete the user from user chats as well

    const userChats = await getUserChats(userToRemoveId);

    for (const key in userChats) {
        const currentChatId = userChats[key];

        if (currentChatId === chatData.key) {
            await deleteUserChat(userToRemoveId, key);
            break;
        };
    };

    const messageText = userLoggedInData.userId === userToRemoveData.userId ?
        `${userLoggedInData.firstName} left the chat` :
        `${userLoggedInData.firstName} removed ${userToRemoveData.firstName} from the chat`;

    await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};