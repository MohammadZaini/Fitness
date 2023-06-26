import React from "react";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "styled-components";
import { colors } from "../../../infratructure/theme/colors";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";

const ExersicesScreen = props => {

    const chestPath = require("../../../../assets/images/Chest-exercises.jpg")
    const tricepsPath = require("../../../../assets/images/TricepsExercise.jpg")
    const sixPacksPath = require("../../../../assets/images/sixPacks.jpg");
    const bicepsPath = require("../../../../assets/images/bicepsPushUp.jpg");
    const back = require("../../../../assets/images/backExercise.jpg")

    return (
        <SafeAreaView>
            <ScrollView>

                <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 15 }}>Workouts</Text>

                <View style={{ backgroundColor: colors.lightBlue, height: 150, borderBottomRightRadius: 40, borderBottomLeftRadius: 10 }} />
                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 1, photo: chestPath })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey, marginTop: -120 }} >
                        <ExersiceName>CHEST - BEGINNER</ExersiceName>
                        <Card.Cover source={chestPath} />
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 2, photo: tricepsPath })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <ExersiceName>Triceps</ExersiceName>
                        <Card.Cover source={tricepsPath} />
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 3, photo: sixPacksPath })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <ExersiceName>Six packs</ExersiceName>
                        <Card.Cover source={sixPacksPath} />
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 4, photo: bicepsPath })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <ExersiceName>Biceps</ExersiceName>
                        <Card.Cover source={bicepsPath} />
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 5, photo: back })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <ExersiceName>Back</ExersiceName>
                        <Card.Cover source={back} />
                    </Card>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ExersicesScreen;

export const ExersiceName = styled.Text`
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
    padding: 5px;
`