import { styled } from "styled-components";

export const ParticipantsContainer = styled.View`
    width: 100%;
    margin-top: 10px;
    margin-left: 10px
`;

export const ParticipantsHeading = styled.Text`
    margin-vertical: 8px;
    font-weight: bold;
`;

export const SuccessMessageText = styled.Text`
`;

export const ScrollViewContainer = styled.ScrollView.attrs(() => ({
    contentContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    showsVerticalScrollIndicator: false
}))``;