import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import userImage from "../../assets/images/userImage.jpeg"
import { StyleSheet } from "react-native";
import { colors } from "../infratructure/theme/colors";
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from "styled-components";
import { launchImagePicker, uploadImageAsync } from "../utils/image-picker-helper";
import { updatedSignedInUserData } from "../utils/actions/auth-actions";

export const ProfileImage = props => {
    const source = props.uri ? { uri: props.uri } : userImage;

    const userId = props.userId;

    const [image, setImage] = useState(source);

    const pickImage = async () => {

        try {
            const tempUri = await launchImagePicker();

            if (!tempUri) return;

            const uploadUrl = await uploadImageAsync(tempUri);

            if (!uploadUrl) {
                throw new Error("Could not upload image")
            }

            await updatedSignedInUserData(userId, { profilePicture: uploadUrl });

            setImage({ uri: uploadUrl });
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <TouchableOpacity onPress={pickImage} >
            <Image source={image} style={{ ...styles.image, ...{ height: props.size, width: props.size } }} />
            <ShowIconContainer  >
                <MaterialIcons name="edit" size={24} color={"black"} style={styles.icon} />
            </ShowIconContainer>
        </TouchableOpacity>
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
    padding: 8px;
`;
