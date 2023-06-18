import React, { useEffect } from "react";
import { Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { CustomHeaderButton } from "../components/custom-header-button.component";
const ChatListScreen = props => {

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                    <Item
                        title="new chat"
                        iconName="create-outline"
                        onPress={() => props.navigation.navigate("NewChat")}
                    />
                </HeaderButtons>
            }
        })
    }, [])

    return (
        <Text>ChatList Screen</Text>
    );
};

export default ChatListScreen;