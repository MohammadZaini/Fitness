import { styled } from 'styled-components';
import { colors } from '../../../infratructure/theme/colors';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
export const ChatsBackground = styled.ImageBackground.attrs({
    source: require('../../../../assets/images/chat-background.jpg')
})`
    height: 100%;
    width: 100%;
    flex: 1
`;

export const ChatInput = styled.TextInput.attrs(props => ({
    value: props.value,
    onChangeText: props.onChangeText
}))`
    flex: 1;
    border-radius: 20px;
    border-width: 1px;
    margin-horizontal: 10px;
    padding: 8px;
    border-color: ${colors.lightGrey};
`;

export const BottomView = styled.View`
    flex-direction: row;
    height: 50px;
    padding: 8px;
`;

export const SendMessageIcon = styled(Ionicons).attrs({
    name: "send",
    size: 20,
    color: "white"
})`
    border-width: 1px;
    border-radius: 50px; 
    padding: 6px;
    background-color: ${colors.primary}; 
    border-color: ${colors.primary};
`;

export const SendImageIcon = styled(Feather).attrs({
    name: "plus",
    size: 27,
    color: colors.primary
})`
    justify-content: center;
    align-items: center;
`;

export const TakePictureIcon = styled(Feather).attrs({
    name: "camera",
    size: 27,
    color: colors.primary
})`
    justify-content: center;
    align-items: center;
`;

export const HeaderImage = styled(Image).attrs(props => ({
    source: props.source
}))`
    height: 40px;
    width: 40px;
    border-radius: 25px;
    position: absolute;
    top: 45px;
    right: 0px;
    left: 50px;
`;

