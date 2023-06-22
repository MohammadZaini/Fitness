import React, { useEffect, useState } from "react";
import { Image, Text } from "react-native";
import MuscleWiki from "../../../api/MuscleWiki";
import { View, Switch } from "react-native";
import { FlatList } from "react-native";

const ExersiceDetails = props => {
    const [apiResults, setApiResults] = useState([]);
    const exerciseId = props.route.params.id;

    const getExercies = async () => {
        try {
            const results = await MuscleWiki.get(`/${exerciseId}`)
            console.log(JSON.stringify(results.data, 0, 2));
            setApiResults(results.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getExercies();
    }, [])
    return (
        <View>
            <Text>{apiResults.exercise_name}</Text>

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