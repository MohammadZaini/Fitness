import React, { useRef } from "react";
import { View } from "react-native";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { Octicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from "react-native";
import { Menu, MenuTrigger, MenuOptions } from "react-native-popup-menu";
import uuid from "react-native-uuid"
import * as Clipboard from "expo-clipboard"
import { MenuItem } from "./menu-item.component";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteMessage, starMessage } from "../../../utils/actions/chat-actions";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import { ProfileImage } from "../../../components/profile-image.component";
import { styled } from "styled-components";
import { FontAwesome5 } from '@expo/vector-icons';
export const Bubble = props => {
    const { text, type, date, userId, chatId, messageId, setReply, replyingTo, name, imageUrl, uri, isGroupChat } = props;

    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});
    const storedUsers = useSelector(state => state.users.storedUsers);

    const userData = useSelector(state => state.auth.userData);


    function formatDateAmPm(dateString) {
        const date = new Date(dateString);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    };

    let Container = View;
    const menuRef = useRef(null);
    const id = useRef(uuid.v4())

    let isUserMessage = false;

    const dateString = date && formatDateAmPm(date)
    const bubbleStyle = { ...styles.container };
    const textStyle = { ...styles.text };
    const wrapperStyle = { ...styles.wrapperStyle }

    switch (type) {
        case "system":
            bubbleStyle.backgroundColor = colors.lightBlue;
            break;

        case "error":
            bubbleStyle.backgroundColor = colors.error
            break;

        case "myMessage":
            bubbleStyle.backgroundColor = colors.primary;
            bubbleStyle.maxWidth = "90%"
            wrapperStyle.justifyContent = 'flex-end';
            bubbleStyle.borderBottomRightRadius = 1;
            Container = TouchableWithoutFeedback;
            isUserMessage = true;
            break;

        case "theirMessage":
            bubbleStyle.backgroundColor = colors.lightGrey;
            wrapperStyle.justifyContent = 'flex-start';
            bubbleStyle.borderTopLeftRadius = 1;
            Container = TouchableWithoutFeedback;
            isUserMessage = true;
            break;

        case "reply":
            bubbleStyle.backgroundColor = colors.lightBlue;
            break;

        case "info":
            bubbleStyle.justifyContent = 'center';
            bubbleStyle.backgroundColor = colors.lightBlue;
            break;

        case "myStarredMessages":
            bubbleStyle.backgroundColor = colors.primary;
            wrapperStyle.justifyContent = 'flex-start';
            bubbleStyle.borderTopLeftRadius = 1;
            isUserMessage = true;
            break;

        case "thierStarredMessages":
            bubbleStyle.backgroundColor = colors.lightGrey;
            wrapperStyle.justifyContent = 'flex-start';
            bubbleStyle.borderTopLeftRadius = 1;
            isUserMessage = true;
            break;


        default:
            break;
    }

    const copyToClipboard = async text => {
        try {
            await Clipboard.setStringAsync(text)
        } catch (error) {
            console.log(error);
        };
    };

    const isStarred = isUserMessage && starredMessages[messageId] !== undefined;
    const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];
    const isOwnReply = replyingToUser && replyingToUser.userId === userData.userId;

    const isStarredMessage = type === "myStarredMessages" || type === "thierStarredMessages";

    return (
        <View style={wrapperStyle}  >
            {
                type === "theirMessage" && isGroupChat || isStarredMessage ?
                    <ProfileImage uri={uri} size={isStarredMessage ? 25 : 30} style={{ marginRight: 5 }} /> : ""
            }
            <Container onLongPress={() => menuRef.current.props.ctx.menuActions.openMenu(id.current)} >
                <View style={bubbleStyle} >

                    {
                        name && type !== "info" &&
                        <ChatterName >{name}</ChatterName>
                    }

                    {
                        replyingToUser &&
                        <Bubble
                            type="reply"
                            text={replyingTo.text}
                            name={
                                isOwnReply ?
                                    "You" :
                                    `${replyingToUser.firstName} ${replyingToUser.lastName}`
                            }
                        />

                    }
                    {
                        !imageUrl &&
                        // Text message
                        <Text style={textStyle}>
                            {text}
                        </Text>
                    }

                    {
                        imageUrl &&
                        <ChatImage source={{ uri: imageUrl }} />
                    }

                    {
                        date && type !== "info" &&
                        <StarredIconContainer>
                            {/* <FontAwesome5 name="check-double" size={10} color={colors.primary} style={{ alignSelf: 'center', flex: 1 }} /> */}

                            {
                                isStarred &&
                                <StarredIcon />
                            }
                            <Text style={styles.time}>{dateString}</Text>
                        </StarredIconContainer>
                    }

                    {
                        !isStarredMessage &&
                        (
                            <Menu name={id.current} ref={ref => menuRef.current = ref} >
                                <MenuTrigger />

                                <MenuOptions optionsContainerStyle={{ borderRadius: 20, backgroundColor: colors.lightBlue }}>

                                    <MenuItem text="Copy to clipboard" onSelect={() => copyToClipboard(text)} iconPack={Ionicons} icon="ios-copy-outline" />
                                    <MenuItem text={`${isStarred ? "Unstar" : "Star"} message`} onSelect={() => starMessage(userId, chatId, messageId)} iconPack={Octicons} icon={`${isStarred ? "star-fill" : "star"}`} color={isStarred ? colors.yellow : "black"} />
                                    <MenuItem text="Reply to message" onSelect={setReply} iconPack={MaterialIcons} icon="reply" />
                                    <MenuItem text="Delete message" onSelect={() => deleteMessage(chatId, messageId)} iconPack={MaterialIcons} icon="delete" color={colors.red} />

                                </MenuOptions>

                            </Menu>
                        )
                    }
                </View>
            </Container>
        </View >
    );
};

const styles = StyleSheet.create({
    wrapperStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        padding: 5,
        marginTop: 10,
        borderRadius: 7,
        fontFamily: fonts.body,
        marginBottom: 2
    },
    text: {
        letterSpacing: 0.3,
        fontFamily: fonts.body,
    },
    time: {
        fontSize: 12,
        color: "white"
    }
});

const ChatImage = styled(Image)`
    height: 300px;
    width: 300px; 
`;
const StarredIconContainer = styled.View`
    flex-direction: row;
    justify-content: flex-end;
`;

const StarredIcon = styled(Octicons).attrs({
    name: "star-fill",
    size: 14,
    color: colors.yellow
})`
    margin-right: 10px;
`;

const ChatterName = styled.Text`
    font-weight: bold;
`;


