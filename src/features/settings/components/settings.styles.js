import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";

export const SuccessMessageContainer = styled.View`
    height: 30px;
    width: 50px;
    background-color: ${colors.primary}; 
    border-radius: 5px;
    align-items: center; 
    padding: 2px;
    margin-top: 15px;
    justify-content: center;
`;