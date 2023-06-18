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

export const ProfileImage = props => {
    const dispatch = useDispatch()

    const source = props.uri ? { uri: props.uri } : userImage;

    const userId = props.userId;

    const [image, setImage] = useState(source);
    const [isLoading, setIsloading] = useState(false);

    const pickImage = async () => {

        try {
            const tempUri = await launchImagePicker();

            if (!tempUri) return;

            setIsloading(true);
            const uploadUrl = await uploadImageAsync(tempUri);
            setIsloading(false);

            if (!uploadUrl) {
                throw new Error("Could not upload image")
            }

            const newData = { profilePicture: uploadUrl }

            await updatedSignedInUserData(userId, newData);
            dispatch(updateLoggedInUserData({ newData }));


            setImage({ uri: uploadUrl });
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <TouchableOpacity onPress={pickImage} >

            {
                isLoading ?
                    <View height={props.size} width={props.size} style={{ alignItems: 'center', justifyContent: 'center' }} >
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View> :
                    <Image source={image} style={{ ...styles.image, ...{ height: props.size, width: props.size } }} />
            }

            <ShowIconContainer  >
                <MaterialIcons name="edit" size={20} color={"black"} style={styles.icon} />
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
    padding: 7px;
`;
