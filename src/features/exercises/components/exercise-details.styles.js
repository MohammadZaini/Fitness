import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";

export const Category = styled.Text`
    background-color: ${colors.primary};
    margin: 10px;
    border-radius: 20px;
    max-width: 80%;
    padding: 5px;
    font-family: ${fonts.body};
`;

export const CategoryHeader = styled.Text`
    font-weight: bold;
`;

export const Header = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
    margin-bottom: 7px;
`;

export const Steps = styled.Text`
    font-family: ${fonts.body};
    margin-bottom: 10px;
    margin-horizontal: 10px;
`;