import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { getFirebaseApp } from "../firebase-helper";

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
        await push(child(dbRef, `chatUsers/${userId}`), newChat.key);
    };

    return newChat.key;
};

export const sendTextMessage = async (chatId, senderId, messageText, type) => {

    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const messagesRef = child(dbRef, `messages/${chatId}`);

    const messageData = {
        sentBy: senderId,
        sentAt: new Date().toISOString(),
        text: messageText
    };

    await push(messagesRef, messageData);

    const chatRef = child(dbRef, `chats/${chatId}`);

    await update(chatRef, {
        updatedBy: senderId,
        updatedAt: new Date().toISOString(),
        latestTextMessage: messageText
    });
};

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