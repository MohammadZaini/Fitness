import React from "react";
import { View } from "react-native";
import { Button, ImageBackground, Text } from "react-native";

const ExersicesScreen = props => {
    return (
        <View>
            <ImageBackground source={require("../../../../assets/images/chat-background.jpg")} style={{ height: "100%", width: "100%" }} />
        </View>
    );
};

export default ExersicesScreen;