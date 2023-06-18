import React from "react";
import { View, Image } from "react-native";
import userImage from "../../assets/images/userImage.jpeg"
import { StyleSheet } from "react-native";
import { colors } from "../infratructure/theme/colors";
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from "styled-components";

export const ProfileImage = props => {
    return (
        <View>
            <Image source={userImage} style={{ ...styles.image, ...{ height: props.size, width: props.size } }} />
            <ShowIconContainer  >
                <MaterialIcons name="edit" size={24} color={"black"} style={styles.icon} />
            </ShowIconContainer>
        </View>
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
