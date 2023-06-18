import { styled } from 'styled-components';
import { colors } from '../../../infratructure/theme/colors';
import { Feather } from '@expo/vector-icons';

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

export const SendIcon = styled(Feather).attrs({
    name: "send",
    size: 20,
    color: "white"
})`
    border-width: 1px;
    border-radius: 50px; 
    padding: 7px;
    background-color: ${colors.blue}; 
    border-color: ${colors.blue};
`;

export const SendImageIcon = styled(Feather).attrs({
    name: "plus",
    size: 24,
    color: colors.primary
})`
    justify-content: center;
    align-items: center;
`;

export const TakePictureIcon = styled(Feather).attrs({
    name: "camera",
    size: 24,
    color: colors.primary
})`
    justify-content: center;
    align-items: center;
`;
