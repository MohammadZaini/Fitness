import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";
import { fonts } from "../../../infratructure/theme/fonts";
import { Image } from "react-native";

export const SafeArea = styled(SafeAreaView)`
    justify-content: center;
    align-items: center;
`;

export const DumbbellImage = styled(Image).attrs({
    source: require("../../../../assets/images/dumbbell-gym.png"),
})`
    height: 150px; 
    width: 200px;
    margin-vertical: 20px;
`;

export const AccountAvailability = styled.Text`
    color: ${colors.primary};
    font-family: ${fonts.body}
`;