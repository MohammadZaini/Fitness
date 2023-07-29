import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";

export const Input = props => {
    const [value, setValue] = useState(props.initialValue);

    const onChangeText = text => {
        setValue(text);
        props.onInputChanged(props.id, text);
    };


    useEffect(() => {
        if (props.initialValue) {
            setValue(props.initialValue)
        }
    }, [props.initialValue]);

    const test = value ? "There is a value" : "There is no value";
    console.log("Initial Value is: " + props.initialValue);
    console.log("Input Component, the value is ===> " + test + " " + value);
    const labelTextColor = props.labelColor === "grey" && "black" || props.labelColor;

    return (
        <View >
            <InputLabel color={labelTextColor ?? "white"}>{props.label}</InputLabel>

            <InputContainer color={props.color} >

                {
                    props.iconPack &&
                    <props.iconPack name={props.icon} size={15} color={props.iconColor} style={{ marginRight: 5, padding: 5 }} />
                }

                <TextInput
                    {...props}
                    value={value}
                    style={{ ...{ height: 35, width: 300, letterSpacing: 0.3 }, ...props.style }}
                    onChangeText={onChangeText}
                    selectionColor={colors.primary}
                />

            </InputContainer>

            {
                props.errorText &&
                <ErrorMessage>{props.errorText[0]}</ErrorMessage>
            }
        </View>
    );
};

const InputLabel = styled.Text`
    color: ${props => props.color};
    margin-vertical: 5px;
    margin-left: 10px;
    font-family: ${fonts.body}
`;

const ErrorMessage = styled.Text`
    color: ${colors.error};
    font-size: 12px;
    margin-left: 5px;
`;

const InputContainer = styled.View`
    border-color: ${props => props.color};
    flex-direction: row;
    border-width: 1px; 
    border-radius: 40px;
    justify-content: center;
    alignItems: center;
    padding: 3px;
`;