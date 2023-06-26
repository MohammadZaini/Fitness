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
    const bicepsPath = require("../../../../assets/images/biceps-muscle.jpg");
    const back = require("../../../../assets/images/back-muscle.jpg")
    const legs = require("../../../../assets/images/leg-muscle.jpg")

    return (
        <SafeAreaView>
            <ScrollView>

                <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 15 }}>Workouts</Text>

                {/* <View style={{ backgroundColor: colors.lightBlue, height: 150, borderBottomRightRadius: 40, borderBottomLeftRadius: 10 }} /> */}
                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 1, exerciseType: "Chest" })}>


                    <Card style={{ margin: 15 }} >
                        <Card.Cover source={chestPath} />
                    </Card>
                    <ExersiceName>CHEST - BEGINNER</ExersiceName>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 2, exerciseType: "Triceps" })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <Card.Cover source={tricepsPath} />
                    </Card>
                    <ExersiceName>TRICEPS</ExersiceName>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 3, exerciseType: "Abdominals" })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <Card.Cover source={sixPacksPath} />
                    </Card>
                    <ExersiceName>SIX PACKS</ExersiceName>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 4, exerciseType: "Biceps" })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <Card.Cover source={bicepsPath} />
                    </Card>
                    <ExersiceName>BICEPS</ExersiceName>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 5, exerciseType: "Quads" })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <Card.Cover source={legs} />
                    </Card>
                    <ExersiceName>LEGS</ExersiceName>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 5, exerciseType: "Mid back" })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <Card.Cover source={back} />
                    </Card>
                    <ExersiceName>BACK</ExersiceName>
                </TouchableOpacity>


            </ScrollView>
        </SafeAreaView>
    );
};

export default ExersicesScreen;

export const ExersiceName = styled.Text`
    font-weight: bold;
    font-size: 18px;
    position: absolute;
    left: 20px;
    top: 25px;
`