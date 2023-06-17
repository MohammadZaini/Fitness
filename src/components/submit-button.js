import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../infratructure/theme/colors";
import { fonts } from "../infratructure/theme/fonts";

export const SubmitButton = props => {

    const enabledBgColor = props.color || colors.primary
    const disabledBgColor = colors.disabledButton;
    const bgColor = props.disabled ? disabledBgColor : enabledBgColor

    return (

        <TouchableOpacity
            onPress={props.disabled ? () => { } : props.onPress}
            style={{ ...styles.button, ...{ backgroundColor: bgColor } }}>

            <Text style={{ marginVertical: 8, fontFamily: fonts.body }
            } > {props.title}</ Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "green",
        height: 40, width: "80%",
        borderRadius: 40,
        marginVertical: 20,
        alignContent: 'center',
        alignItems: 'center',
    }
});