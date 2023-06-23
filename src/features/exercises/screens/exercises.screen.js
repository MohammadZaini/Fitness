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

    return (
        <SafeAreaView>
            <ScrollView>

                <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 15 }}>Workouts</Text>

                <View style={{ backgroundColor: colors.lightBlue, height: 150, borderBottomRightRadius: 40, borderBottomLeftRadius: 10 }} />
                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 1 })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey, marginTop: -120 }} >
                        <ExersiceName>Chest</ExersiceName>
                        <Text>Beginner</Text>
                        <Card.Cover source={require("../../../../assets/images/Chest-exercises.jpg")} />
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 2 })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <ExersiceName>Triceps</ExersiceName>
                        <Card.Cover source={require("../../../../assets/images/TricepsExercise.jpg")} />
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("ExerciseDetails", { id: 3 })}>
                    <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                        <ExersiceName>Six packs</ExersiceName>
                        <Card.Cover source={require("../../../../assets/images/sixPacks.jpg")} />
                    </Card>
                </TouchableOpacity>

                <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                    <ExersiceName>Biceps</ExersiceName>
                    <Card.Cover source={require("../../../../assets/images/bicepsPushUp.jpg")} />
                </Card>

                <Card style={{ margin: 15, backgroundColor: colors.lightGrey }} >
                    <ExersiceName>Back</ExersiceName>
                    <Card.Cover source={require("../../../../assets/images/backExercise.jpg")} />
                </Card>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ExersicesScreen;

const ExersiceName = styled.Text`
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
    padding: 5px;
`