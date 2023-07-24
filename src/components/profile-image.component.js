import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import userImage from "../../assets/images/userImage.jpeg"
import { StyleSheet } from "react-native";
import { colors } from "../infratructure/theme/colors";
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from "styled-components";
import { launchImagePicker, uploadImageAsync } from "../utils/image-picker-helper";
import { updatedSignedInUserData } from "../utils/actions/auth-actions";
import { updateLoggedInUserData } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { updateChatData } from "../utils/actions/chat-actions";

export const ProfileImage = props => {
    const dispatch = useDispatch()

    const source = props.uri ? { uri: props.uri } : userImage;

    const userId = props.userId;
    const chatId = props.chatId;

    const showEditButton = props.showEditButton && props.showEditButton === true
    const showRemoveButton = props.showRemoveButton && props.showRemoveButton === true

    const [image, setImage] = useState(source);
    const [isLoading, setIsloading] = useState(false);

    const pickImage = async () => {

        try {
            const tempUri = await launchImagePicker();

            if (!tempUri) return;

            setIsloading(true);
            const uploadUrl = await uploadImageAsync(tempUri, chatId !== undefined);
            setIsloading(false);

            if (!uploadUrl) {
                throw new Error("Could not upload image")
            }

            if (chatId) {
                await updateChatData(chatId, userId, { chatImage: uploadUrl })
            } else {
                const newData = { profilePicture: uploadUrl }

                await updatedSignedInUserData(userId, newData);
                dispatch(updateLoggedInUserData({ newData }));
            }

            setImage({ uri: uploadUrl });
        } catch (error) {
            console.log(error);
        };
    };

    const Container = props.onPress || showEditButton ? TouchableOpacity : View;

    return (
        <Container style={props.style} onPress={props.onPress || pickImage} >

            {
                isLoading ?
                    <View height={props.size} width={props.size} style={{ alignItems: 'center', justifyContent: 'center' }} >
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View> :
                    <Image source={image} style={{ ...styles.image, ...{ height: props.size, width: props.size }, ...{ ...props.style } }} />
            }

            {
                showEditButton && !isLoading &&
                <ShowIconContainer  >
                    <MaterialIcons name="edit" size={20} color={"black"} style={styles.icon} />
                </ShowIconContainer>
            }

            {
                showRemoveButton && !isLoading &&
                <ShowRemoveIconContainer  >
                    <Ionicons name="remove-circle-sharp" size={24} color={colors.error} />
                </ShowRemoveIconContainer>
            }
        </Container>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 80,
        width: 80,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.disabledButton,
        marginVertical: 10
    },
});

const ShowIconContainer = styled.View`
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: ${colors.lightGrey};
    border-radius: 20px;
    padding: 7px;
`;

const ShowRemoveIconContainer = styled.View`
    position: absolute;
    bottom: 0;
    right: 0;
    top: -10px;
    left: -5px;
    border-radius: 20px;
    padding: 7px;
`;

