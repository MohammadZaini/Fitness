import React, { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";

export const Input = props => {
    const [value, setValue] = useState(props.initialValue);

    const onChangeText = text => {
        setValue(text);
        props.onInputChanged(props.id, text);
    };

    const labelTextColor = props.labelColor === "grey" && "black" || props.labelColor;

    return (
        <View  >
            <Text style={{ marginLeft: 10, marginVertical: 5, fontFamily: fonts.body, color: labelTextColor }} >{props.label}</Text>
            <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 40, borderColor: props.color, justifyContent: 'center', alignItems: 'center', padding: 3, }} >

                {
                    props.iconPack &&
                    <props.iconPack name={props.icon} size={15} color={props.iconColor} style={{ marginRight: 5, padding: 5 }} />
                }
                <TextInput
                    {...props}
                    value={value}
                    style={{ ...{ height: 35, width: 300, letterSpacing: 0.3 }, ...{ ...props.style } }}
                    onChangeText={onChangeText}
                />
            </View>

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


