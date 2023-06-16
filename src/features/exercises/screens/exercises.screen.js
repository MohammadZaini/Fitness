import React from "react";
import { Button, Text } from "react-native";

const ExersicesScreen = props => {
    return (
        <Button title="Go to Auth screen" onPress={() => props.navigation.navigate("Auth")} />
    );
};

export default ExersicesScreen;