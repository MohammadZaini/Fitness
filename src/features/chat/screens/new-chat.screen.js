import React from "react";
import { Button, Text } from "react-native";

const NewChatScreen = props => {
    return (
        <>
            <Button title="go to chat screen" onPress={() => props.navigation.navigate("Chat")} />
        </>
    );
};

export default NewChatScreen;