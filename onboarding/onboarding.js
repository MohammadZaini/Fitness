import React, { useContext, useRef, useState } from "react";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { View, Animated } from "react-native";
import onboardingSlides from "./onboardingSlides";
import OnboardingItem from "./onboarding-item";
import Paginator from "./paginator";
import NextButton from "./next-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContext } from "@react-navigation/native";

const Onboarding = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current; // A reference to an animated value using the horizontal scroll position of the flatlist
    const slidesRef = useRef(null);

    const navigation = useContext(NavigationContext);
    console.log(navigation);
    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index)
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = async () => {
        if (currentIndex < onboardingSlides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 })
        } else {
            try {
                await AsyncStorage.setItem('@viewedOnboarding', 'true')

                // const pushAction = StackActions.push("Exercises", { chatId });
                // navigation.dispatch(pushAction);
                navigation.navigate("Home")
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <View style={styles.container} >
            <View style={{ flex: 3 }}>
                <FlatList
                    data={onboardingSlides}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <Paginator data={onboardingSlides} scrollX={scrollX} />
            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / onboardingSlides.length)} />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Onboarding;