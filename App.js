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
import { useEffect, useState } from "react";

export default function App() {
  const [isloading, setIsLoading] = useState(true);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);

  AsyncStorage.clear();

  const Loading = () => {
    return <View style={{ justifyContent: 'center', flex: 1 }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  }

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem('@viewedOnboarding');

      if (value !== null) {
        setViewedOnboarding(true);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkOnboarding();
  }, [])

  const [oswaldLoaded] = useFonts({
    Oswald_400Regular,
  });

  if (!oswaldLoaded) {
    return null;
  };

  return (
    <Provider store={store} >
      <MenuProvider>

        {
          isloading ? <Loading /> : viewedOnboarding ? <Navigation /> : <Onboarding />
        }

      </MenuProvider>
    </Provider>
  );
};