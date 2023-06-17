import React, { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";

export const Input = props => {
    const [value, setValue] = useState("");

    const onChangeText = text => {
        setValue(text);
        props.onInputChanged(props.id, text)
    };

    labelTextColor = props.labelColor === "grey" && "white" || props.labelColor

    return (
        <View  >
            <Text style={{ marginLeft: 10, marginVertical: 5, fontFamily: fonts.body, color: labelTextColor }} >{props.label}</Text>
            <TextInput
                {...props}
                value={value}
                style={{ height: 40, width: 350, borderRadius: 40, padding: 9, letterSpacing: 0.3, borderWidth: 1, borderColor: props.color }}
                onChangeText={onChangeText}
            />

            {
                props.errorText &&
                <ErrorMessage>{props.errorText[0]}</ErrorMessage>
            }
        </View>
    )
};

const ErrorMessage = styled.Text`
    color: ${colors.error};
    font-size: 12px;
    margin-left: 5px;
`

