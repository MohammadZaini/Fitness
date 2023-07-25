import React from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { PageContainer } from "../../../components/page-container";
import { ScrollView } from "react-native";
import { ProfileImage } from "../../../components/profile-image.component";
import { useCallback } from "react";
import { InputValidation } from "../../../utils/actions/form-actions";
import { useReducer } from "react";
import { reducer } from "../../../utils/reducers/form-reducer";
import { addUsersToChat, removeUserFromChat, updateChatData } from "../../../utils/actions/chat-actions";
import { useState } from "react";
import { Input } from "../../account/components/input.components";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";
import { SubmitButton } from "../../../components/submit-button";
import { SuccessMessageContainer } from "../../settings/components/settings.styles";
import { styled } from "styled-components";
import { DataItem } from "../../../components/data-item.component";
import { useEffect } from "react";

const ChatSettingsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const chatId = props.route.params.chatId;
    const selectedUsers = props.route.params && props.route.params.selectedUsers;
    const chatData = useSelector(state => state.chats.chatsData[chatId] || {});
    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});

    const setLoggedInUserAsFirstItemInArray = array => {
        let sortedUsers = [];
        for (let i = 0; i < array.length; i++) {
            let uid = array[i];
            sortedUsers.push(uid)
            if (uid === userData.userId) {
                sortedUsers.splice(i, 1)
                sortedUsers.unshift(uid);
            };
        };
        return sortedUsers;
    };

    const initialState = {
        inputValues: { chatName: chatData.chatName },
        inputValidities: { chatName: undefined },
        inputIsValidColor: { chatName: "grey" },
        formIsValid: false
    };

    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!selectedUsers) return;

        const selectedUsersData = [];

        selectedUsers.forEach(uid => {
            if (uid === userData.userId) return;

            if (!storedUsers[uid]) {
                console.log("No user data found in the data store");
                return;
            };

            selectedUsersData.push(storedUsers[uid])
        });

        addUsersToChat(userData, selectedUsersData, chatData);
    }, [selectedUsers]);

    const onChangedHandler = useCallback((inputId, inputValue) => {
        const result = InputValidation(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const saveHandler = useCallback(async () => {
        const updatedValues = formState.inputValues

        try {
            setIsLoading(true)
            await updateChatData(chatId, userData.userId, updatedValues)


            setShowSuccessMessage("Saved!");

            setTimeout(() => {
                setShowSuccessMessage("");
            }, 3000);

            setIsLoading(false);

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        };
    }, [formState]);

    const hasChanges = () => {
        const currentValues = formState.inputValues;
        return currentValues.chatName !== chatData.chatName
    };

    const leaveChat = useCallback(async () => {
        try {
            setIsLoading(true);

            await removeUserFromChat(userData, userData, chatData)
            props.navigation.popToTop();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [props.navigation, isLoading]);


    if (!chatData.users) return null;

    return (
        <PageContainer>
            <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} showsVerticalScrollIndicator={false}>
                <ProfileImage
                    size={80}
                    uri={chatData.chatImage}
                    showEditButton={true}
                    chatId={chatId}
                    userId={userData.userId}
                />

                <Input
                    id="chatName"
                    label="Chat name"
                    autoCapitalize="none"
                    initialValue={chatData.chatName}
                    allowEmpty={false}
                    onInputChanged={onChangedHandler}
                    errorText={formState.inputValidities["chatName"]}
                    style={{ width: "100%", padding: 5, }}
                />

                {
                    showSuccessMessage &&
                    <SuccessMessageContainer >
                        <Text>{showSuccessMessage}</Text>
                    </SuccessMessageContainer >
                }

                <ParticipantsContainer >
                    <ParticipantsHeading>{chatData.users.length} Participants</ParticipantsHeading>
                    <DataItem
                        title="Add participants"
                        icon="person-add-outline"
                        type="button"
                        onPress={() => props.navigation.navigate("NewChat", { isGroupChat: true, existingUsers: chatData.users, chatId })}
                    />

                    {
                        setLoggedInUserAsFirstItemInArray(chatData.users).slice(0, 4).map(uid => {
                            const currentUser = storedUsers[uid];
                            const isLoggedInUser = currentUser.userId === userData.userId;

                            return <DataItem
                                key={uid}
                                uri={currentUser && currentUser.profilePicture}
                                title={currentUser && isLoggedInUser ? "You" : `${currentUser.firstName} ${currentUser.lastName}`}
                                subTitle={currentUser && currentUser.about}
                                type={uid !== userData.userId && "link"}
                                onPress={() => uid !== userData.userId && props.navigation.navigate("Contact", { uid, chatId })}
                            />
                        })
                    }

                    {
                        chatData.users.length > 3 &&
                        <DataItem
                            title="View all"
                            type="link"
                            hideImage={true}
                            onPress={() => props.navigation.navigate("DataList", {
                                title: "Participants",
                                data: setLoggedInUserAsFirstItemInArray(chatData.users),
                                type: "users",
                                chatId
                            })}
                        />
                    }

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
                </ParticipantsContainer>

                {
                    isLoading ?
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} /> :
                        hasChanges() && <SubmitButton
                            title="Save changes"
                            color={colors.primary}
                            onPress={saveHandler}
                            disabled={!formState.formIsValid}
                        />

                }

            </ScrollView>

            {
                isLoading ?
                    <ActivityIndicator size="small" color={colors.red} style={{ justifyContent: 'center', alignItems: 'center' }} /> :
                    <SubmitButton
                        title="Leave chat"
                        color={colors.red}
                        style={{ marginHorizontal: 40 }}
                        onPress={leaveChat}
                    />
            }
        </PageContainer>
    );
};

export default ChatSettingsScreen;

const ParticipantsContainer = styled.View`
    width: 100%;
    margin-top: 10px;
    margin-left: 10px
`;

const ParticipantsHeading = styled.Text`
    margin-vertical: 8px;
    font-weight: bold;
`;

