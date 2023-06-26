import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import MuscleWiki from "../../../services/api/MuscleWiki";
import { View, Switch } from "react-native";
import { FlatList } from "react-native";
import { colors } from "../../../infratructure/theme/colors";
import { Card } from "react-native-paper";
import { ExersiceName } from "./exercises.screen";
import { ScrollView } from "react-native";

const ExersiceDetails = props => {
    const [apiResults, setApiResults] = useState([]);
    const exerciseId = props.route.params.id;
    const photoPath = props.route.params.photo;

    const getExercies = async () => {
        try {
            const results = await MuscleWiki.get(``, {
                params: {
                    name: "Chest",
                    difficulty: "Beginner"
                }
            });
            setApiResults(results.data);
            console.log(JSON.stringify(results.data, 0, 2));
        } catch (error) {
            console.log(error);
        };
    };

    const filterDataByDifficulty = () => {
        return (apiResults.filter((exercise) => exercise.Difficulty === "Beginner"))
    };

    // console.log(JSON.stringify(filterDataByDifficulty(), 0, 2));

    useEffect(() => {
        getExercies();
    }, []);

    return (
        <View>


            {/* <Card style={{ margin: 15, backgroundColor: colors.lightGrey, marginTop: 10 }} > */}
            {/* <ExersiceName>Chest</ExersiceName> */}
            {/* <Text>Beginner</Text>  */}
            {/* <Card.Cover source={photoPath} />
            </Card> */}



            <FlatList
                data={apiResults}
                renderItem={({ item }) => {
                    return (
                        <>
                            <Text style={styles.header} >{item.exercise_name}</Text>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} >
                                <Text style={styles.category}>Category: {item.Category}</Text>
                                <Text style={styles.category}>Difficulty: {item.Difficulty}</Text>
                                {item.Grips && <Text style={styles.category}>Grips: {item.Grips}</Text>}
                                {item.Force && <Text style={styles.category}>Force: {item.Force}</Text>}
                            </View>

                            <View>
                                {
                                    item.steps.map((step, index) => {
                                        return <View key={index.toString()}>
                                            <Text>
                                                {index + 1} - {step}
                                            </Text>
                                        </View>

                                    })
                                }
                            </View>
                        </>
                    )
                }}
            />

            {/* 
            <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Steps:</Text>
            <FlatList
                data={apiResults.steps}
                horizontal
                keyExtractor={(key, index) => key.id + index.toString()}
                renderItem={({ item }) => {

                    return <Text>
                        {"-" + item}
                    </Text>
                }}
            /> */}

            {/* <Image source={require("../../../../assets/images/chatting.png")} style={{ height: 350, width: 400 }} /> */}
        </View>
    )
};

const styles = StyleSheet.create({
    category: {
        backgroundColor: colors.primary,
        margin: 10,
        borderRadius: 20,
        maxWidth: "80%",
        padding: 5,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})

export default ExersiceDetails;