import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { colors } from "../../../infratructure/theme/colors";
import { styled } from "styled-components";
import { FontAwesome } from '@expo/vector-icons';
import { fonts } from "../../../infratructure/theme/fonts";

export const ReplyTo = props => {
    const userData = useSelector(state => state.auth.userData);
    const { text, user, onCancel } = props;

    const isMe = user.userId === userData.userId
    const name = isMe ? 'You' : `${user.firstName} ${user.lastName}`

    return <ReplyContainer >
        <View style={{ flex: 1 }} >

            <Name>{name}</Name>
            <ReplyedToText>{text}</ReplyedToText>
        </View>

        <TouchableOpacity onPress={onCancel} >
            <FontAwesome name="close" size={24} color="black" />
        </TouchableOpacity>
    </ReplyContainer>
}

const ReplyContainer = styled.View`
background-color: ${colors.lightBlue};
flex-direction: row;
padding: 8px;
border-left-color: ${colors.lightGrey}; 
border-left-width: 10px;
border-radius: 20px;
`;

const Name = styled.Text`
    font-family: ${fonts.body};
    font-weight: bold;
    letter-spacing: 0.3px;
`

const ReplyedToText = styled.Text`
    font-family: ${fonts.body};
    letter-spacing: 0.3px;
`