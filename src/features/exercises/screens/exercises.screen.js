import React from "react";
import { Text } from "react-native";
import { Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "styled-components";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { workoutsData } from "../components/workouts-data";

const ExersicesScreen = props => {

    return (
        <SafeAreaView>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 15 }}>Workouts</Text>
            <FlatList
                data={workoutsData}
                keyExtractor={card => card.id}
                renderItem={(itemData) => {
                    const cardData = itemData.item
                    return (
                        <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { exerciseType: cardData.type })} >
                            <Card elevation={5} style={{ margin: 15 }}>
                                <Card.Cover source={cardData.image} />
                                <ExersiceName>{cardData.name}</ExersiceName>
                            </Card>
                        </TouchableOpacity>
                    )
                }}
            />
        </SafeAreaView>
    );
};

export default ExersicesScreen;

export const ExersiceName = styled.Text`
    font-weight: bold;
    font-size: 18px;
    position: absolute;
    left: 20px;
    top: 20px;
`;


