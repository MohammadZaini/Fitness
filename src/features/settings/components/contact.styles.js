import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";


export const Container = styled.View`
    justify-content: center;
    align-items: center;
`;

export const CurrentUserName = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const About = styled.Text.attrs(() => {
    numberOfLines = 2;
})`
    font-size: 15px;
    color: ${colors.lightGrey}
`;