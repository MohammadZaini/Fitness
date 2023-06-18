import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomView, ChatInput, ChatsBackground, SendImageIcon, TakePictureIcon } from "../components/chat.styles";

const ChatScreen = props => {
    const chatUsers = props.route?.params?.users;

    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}  >
            <ChatsBackground>

            </ChatsBackground>

            <BottomView >
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} >
                    <SendImageIcon />
                </TouchableOpacity>

                <ChatInput />

                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <TakePictureIcon />
                </TouchableOpacity>

            </BottomView>
        </SafeAreaView>
    );
};

export default ChatScreen;


