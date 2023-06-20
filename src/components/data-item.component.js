import React, { useState } from "react";
import { ProfileImage } from "./profile-image.component";
import { Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { styled } from "styled-components";
import { colors } from "../infratructure/theme/colors";
import { StyleSheet } from "react-native";
import { fonts } from "../infratructure/theme/fonts";

export const DataItem = props => {
    // const [navigating, setIsNavigating] = useState(false);
    return (
        <TouchableWithoutFeedback onPress={props.onPress} >
            <Container>

                <ProfileImage
                    size={40}
                    uri={props.uri} />

                <TextContainer>

                    <View style={{ flexDirection: 'row' }} >
                        <Text
                            style={{ ...styles.title }}
                            numberOfLines={1}
                        >{props.title}
                        </Text>

                        {
                            !props.unOpenedMessages &&
                            <View style={{ backgroundColor: colors.primary, width: 20, borderRadius: 50, alignItems: 'center' }} >
                                <Text>3</Text>
                            </View>
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

            </Container>
        </TouchableWithoutFeedback>
    )
};

const styles = StyleSheet.create({
    iconContainer: {
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightGrey,
        backgroundColor: 'white'
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
