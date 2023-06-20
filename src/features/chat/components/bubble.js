import React, { useRef } from "react";
import { View } from "react-native";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from "react-native";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import uuid from "react-native-uuid"
import * as Clipboard from "expo-clipboard"
import { MenuItem } from "./menu-item.component";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { starMessage } from "../../../utils/actions/chat-actions";

export const Bubble = props => {
    const { text, type, date, userId, chatId, messageId } = props;

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

    const dateString = formatDateAmPm(date)
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
            break;

        case "theirMessage":
            bubbleStyle.backgroundColor = colors.lightGrey;
            wrapperStyle.justifyContent = 'flex-start';
            bubbleStyle.borderBottomLeftRadius = 1;
            Container = TouchableWithoutFeedback;
            break;

        default:
            break;
    }

    const copyToClipBoard = async text => {
        try {
            await Clipboard.setStringAsync(text)
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <View style={wrapperStyle}  >
            <Container onLongPress={() => menuRef.current.props.ctx.menuActions.openMenu(id.current)} >
                <View style={bubbleStyle} >
                    <Text style={textStyle}>
                        {text}
                    </Text>
                    {/* <FontAwesome5 name="check-double" size={10} color={colors.primary} /> */}
                    {
                        date &&
                        <Text style={styles.time}>{dateString}</Text>
                    }

                    <Menu name={id.current} ref={ref => menuRef.current = ref} >
                        <MenuTrigger />

                        <MenuOptions optionsContainerStyle={{ borderRadius: 20, backgroundColor: colors.lightBlue }}>

                            <MenuItem text="Copy to clipboard" onSelect={() => copyToClipBoard(text)} iconPack={Ionicons} icon="ios-copy-outline" color={colors.primary} />
                            <MenuItem text="Star message" onSelect={() => starMessage(userId, chatId, messageId)} icon="star" color={colors.primary} />
                            <MenuItem text="Reply to message" onSelect={() => copyToClipBoard(text)} iconPack={MaterialIcons} icon="reply" color={colors.primary} />

                        </MenuOptions>

                    </Menu>

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
        fontFamily: fonts.body
    },
    time: {
        fontSize: 12,
        color: colors.lightGrey
    }
})

