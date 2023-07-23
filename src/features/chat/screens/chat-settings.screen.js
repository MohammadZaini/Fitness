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
import { updateChatData } from "../../../utils/actions/chat-actions";
import { useState } from "react";
import { Input } from "../../account/components/input.components";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../../infratructure/theme/colors";
import { SubmitButton } from "../../../components/submit-button";
import { SuccessMessageContainer } from "../../settings/components/settings.styles";
import { styled } from "styled-components";
import { DataItem } from "../../../components/data-item.component";

const ChatSettingsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const chatId = props.route.params.chatId;
    const chatData = useSelector(state => state.chats.chatsData[chatId]);
    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);

    const initialState = {
        inputValues: { chatName: chatData.chatName },
        inputValidities: { chatName: undefined },
        inputIsValidColor: { chatName: "grey" },
        formIsValid: false
    };

    const [formState, dispatchFormState] = useReducer(reducer, initialState);

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

    return (
        <PageContainer>
            <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
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
                        title="Add users"
                        icon="person-add-outline"
                        type="button"

                    />

                    {
                        chatData.users.map(uid => {
                            const currentUser = storedUsers[uid];

                            return <DataItem
                                key={uid}
                                uri={currentUser.profilePicture}
                                title={`${currentUser.firstName} ${currentUser.lastName}`}
                                subTitle={currentUser.about}
                                type={uid !== userData.userId && "link"}
                                onPress={() => props.navigation.navigate("Contact", { uid })}
                            />
                        })
                    }
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

