import React from "react";
import { ProfileImage } from "./profile-image.component";
import { Image, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { styled } from "styled-components";
import { colors } from "../infratructure/theme/colors";
import { StyleSheet } from "react-native";
import { fonts } from "../infratructure/theme/fonts";
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export const DataItem = props => {

    return (
        <TouchableWithoutFeedback onPress={props.onPress} >
            <Container>

                <ProfileImage
                    size={40}
                    uri={props.uri} />

                <TextContainer>

                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }} >
                        <Text
                            style={{ ...styles.title }}
                            numberOfLines={1}
                        >{props.title}
                        </Text>

                        {
                            props.userType === "coach" ?
                                <Image source={require("../../assets/images/personal-trainer-icon.png")} style={{ width: 20, height: 20, marginRight: 5 }} />
                                : props.userType === "trainee"
                                    ? <Image source={require("../../assets/images/trainee-icon.png")} style={{ width: 20, height: 20, marginRight: 5 }} />
                                    : ""
                        }

                        {
                            props.gender === "female" ?
                                <Foundation name="female-symbol" size={24} color={colors.female} />
                                : props.gender === "male"
                                    ? <Foundation name="male-symbol" size={24} color={colors.primary} />
                                    : ""
                        }

                    </View>

                    {
                        props.subTitle &&
                        <SubTitle
                            numberOfLines={1}
                        >{props.subTitle}
                        </SubTitle>
                    }

                </TextContainer>

                {
                    props.type === "checkbox" &&
                    <View style={{ ...styles.iconContainer, ...props.isChecked && styles.checkedStyle }}>
                        <Ionicons name="checkmark" size={20} color="black" />
                    </View>
                }
            </Container>
        </TouchableWithoutFeedback>
    )
};

const styles = StyleSheet.create({
    iconContainer: {
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightGrey,
        backgroundColor: 'white',
        marginLeft: 8
    },
    checkedStyle: {
        backgroundColor: colors.primary,
        borderColor: 'transparent'
    },
    title: {
        fontFamily: fonts.body,
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 0.3,
        flex: 1

    }
})


export const Container = styled.View`
    flex-direction: row;
    padding-vertical: 7px;
    border-bottom-color: ${colors.extraLightGrey};
    border-bottom-width: 1px;
    align-items: center;
    min-height: 50px;
`;

export const TextContainer = styled.View`
    margin-left: 14px;
    flex: 1;
`;

export const SubTitle = styled.Text.attrs(props => ({
    numberOfLines: props.numberOfLines,
}))`
    font-size: 14px;
    letter-spacing: 0.3px;
    color: ${colors.lightGrey};
    font-family: ${fonts.body};
`;
