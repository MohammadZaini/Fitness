import React from "react";
import { View } from "react-native";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

export const Bubble = props => {
    const { text, type } = props;

    const bubbleStyle = { ...styles.container };
    const textStyle = { ...styles.text }

    switch (type) {
        case "system":
            bubbleStyle.backgroundColor = colors.primary;
            break;

        case "error":
            bubbleStyle.backgroundColor = colors.error

        default:
            break;
    }

    return (
        <View>
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
        justifyContent: 'center'
    },
    container: {
        padding: 5,
        marginTop: 10,
        borderRadius: 5,
        fontFamily: fonts.body,
    },
    text: {
        letterSpacing: 0.3,
        fontFamily: fonts.body
    }
})

