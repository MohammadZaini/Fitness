import Navigation from "./src/infratructure/navigation";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useFonts, Oswald_400Regular } from '@expo-google-fonts/oswald';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MenuProvider } from "react-native-popup-menu";
import Onboarding from "./onboarding/onboarding";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "./src/infratructure/theme/colors";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  // const [isloading, setIsLoading] = useState(true);
  // const [viewedOnboarding, setViewedOnboarding] = useState(false);
  const [appIsloaded, setAppIsLoaded] = useState(false);

  // AsyncStorage.clear();
  SplashScreen.preventAutoHideAsync();

  // const Loading = () => {
  //   return <View style={{ justifyContent: 'center', flex: 1 }}>
  //     <ActivityIndicator size="large" color={colors.primary} />
  //   </View>
  // }

  // const checkOnboarding = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('@viewedOnboarding');

  //     if (value !== null) {
  //       setViewedOnboarding(true);
  //     }

  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  useEffect(() => {
    // checkOnboarding();
    setTimeout(() => {
      setAppIsLoaded(true);
    }, 2000)
  }, []);


  const onLayout = useCallback(async () => {
    if (appIsloaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsloaded]);

  const [oswaldLoaded] = useFonts({
    Oswald_400Regular,
  });

  if (!oswaldLoaded) {
    return null;
  };

  if (!appIsloaded) {
    return null;
  };

  return (
    <SafeAreaProvider onLayout={onLayout} >
      <Provider store={store} >
        <MenuProvider>

          <Navigation />
        </MenuProvider>
      </Provider>
    </SafeAreaProvider>
  );
};