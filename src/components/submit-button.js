import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../infratructure/theme/colors";

export const SubmitButton = props => {

    const enabledColor = props.isEnabled ? colors.primary : colors.disabledButton

    return (

        <TouchableOpacity
            style={{ ...styles.button, backgroundColor: enabledColor }}>

            <Text style={{ marginVertical: 8 }
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
        alignItems: 'center'
    }
});