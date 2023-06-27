import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MuscleWiki from "../../../services/api/MuscleWiki";
import { View } from "react-native";
import { FlatList } from "react-native";
import { colors } from "../../../infratructure/theme/colors";
import { ActivityIndicator } from "react-native-paper";
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from "react-native-safe-area-context";
import { Category, CategoryHeader, Header, Steps } from "../components/exercise-details.styles";

const ExersiceDetails = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiResults, setApiResults] = useState([]);
    const exerciseType = props.route.params.exerciseType;

    const getExercies = async () => {
        try {
            setIsLoading(true)
            const results = await MuscleWiki.get(``, {
                params: {
                    name: exerciseType,
                }
            });
            setApiResults(results.data);
            setIsLoading(false)
        } catch (error) {
            console.log(error);
        };
    };

    useEffect(() => {
        getExercies();
    }, []);

    if (isLoading) {
        return <>
            <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
        </>
    };

    return (
        <View>
            <SafeAreaView>

                <FlatList
                    data={apiResults.slice(-5)}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'grey' }} >

                                <Header >{item.exercise_name}</Header>

                                {
                                    item.videoURL[0] &&
                                    <Video
                                        style={styles.video}
                                        source={{
                                            uri: item.videoURL[0],
                                        }}
                                        useNativeControls
                                        resizeMode={ResizeMode.CONTAIN}
                                        isLooping
                                    />
                                }

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} >
                                    <Category> <CategoryHeader style={{ fontWeight: 'bold' }} >Category:</CategoryHeader> {item.Category}</Category>
                                    <Category><CategoryHeader style={{ fontWeight: 'bold' }} >Difficulty:</CategoryHeader> {item.Difficulty}</Category>
                                    {
                                        item.Grips &&
                                        <Category><CategoryHeader >Grips:</CategoryHeader> {item.Grips}</Category>
                                    }
                                    {
                                        item.Force &&
                                        <Category><CategoryHeader >Force:</CategoryHeader> {item.Force}</Category>
                                    }
                                    {
                                        item.target.Primary &&
                                        <Category><CategoryHeader >Primary Target:</CategoryHeader> {item.target.Primary[0]}</Category>
                                    }
                                    {
                                        item.target.Secondary &&
                                        <Category><CategoryHeader >Secondary Target:</CategoryHeader> {item.target.Secondary[0]}</Category>
                                    }
                                </View>

                                <Header>Steps</Header>

                                {
                                    item.steps.map((step, index) => {
                                        return <View key={index.toString()}>
                                            <Steps >
                                                {index + 1} - {step}
                                            </Steps>
                                        </View>

                                    })
                                }

                            </View>
                        )
                    }}
                />
            </SafeAreaView>
        </View>
    )
};

const styles = StyleSheet.create({
    video: {
        height: 210,
        width: 350,
        marginLeft: 10,
        borderRadius: 25
    },
})

export default ExersiceDetails;