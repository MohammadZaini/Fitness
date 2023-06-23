import React, { useEffect, useState } from "react";
import { Image, Text } from "react-native";
import MuscleWiki from "../../../services/api/MuscleWiki";
import { View, Switch } from "react-native";
import { FlatList } from "react-native";
import { colors } from "../../../infratructure/theme/colors";

const ExersiceDetails = props => {
    const [apiResults, setApiResults] = useState([]);
    const exerciseId = props.route.params.id;

    const getExercies = async () => {
        try {
            const results = await MuscleWiki.get(``)
            setApiResults(results.data)
        } catch (error) {
            console.log(error);
        }
    }

    const filterDataByDifficulty = () => {
        return (apiResults.filter((exercise) => exercise.Difficulty === "Beginner"))
    }

    console.log(JSON.stringify(filterDataByDifficulty(), 0, 2));

    useEffect(() => {
        getExercies();
    }, [])
    return (
        <View>
            <View style={{ borderRadius: 20, borderWidth: 2, borderColor: colors.lightBlue, flexWrap: 'wrap', maxWidth: 100, backgroundColor: colors.lightBlue }} >
                <Text style={{ padding: 3 }}>{apiResults.exercise_name}</Text>
            </View>

            <Text>{apiResults.Category}</Text>
            <Text>{apiResults.Difficulty}</Text>
            <Text>{apiResults.Grips}</Text>
            {/* <Text>{apiResults.target["Primary"]}</Text> */}
            <Text>{apiResults.details}</Text>

            <FlatList
                data={apiResults.steps}
                keyExtractor={(key, index) => key.id + index.toString()}
                renderItem={({ item }) => {

                    return <Text>
                        {"-" + item}
                    </Text>
                }}
            />

            {/* <Image source={require("../../../../assets/images/chatting.png")} style={{ height: 350, width: 400 }} /> */}
        </View>
    )
};

export default ExersiceDetails;