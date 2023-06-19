import React from "react";
import { View } from "react-native";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

export const Bubble = props => {
    const { text, type } = props;

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
            break;

        case "theirMessage":
            bubbleStyle.backgroundColor = colors.lightGrey;
            wrapperStyle.justifyContent = 'flex-start';
            bubbleStyle.borderBottomLeftRadius = 1;
            break;

        default:
            break;
    }

    return (
        <View style={wrapperStyle}  >
            <View style={bubbleStyle} >
                <Text style={textStyle}>
                    {text}
                </Text>
            </View>
        </View>
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
    },
    text: {
        letterSpacing: 0.3,
        fontFamily: fonts.body
    }
})

