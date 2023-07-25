import Navigation from "./src/infratructure/navigation";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useFonts, Oswald_400Regular } from '@expo-google-fonts/oswald';
import { MenuProvider } from "react-native-popup-menu";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";

export default function App() {
  const [appIsloaded, setAppIsLoaded] = useState(false);

  SplashScreen.preventAutoHideAsync();
  // LogBox.ignoreAllLogs();

  useEffect(() => {

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
      <Provider store={store} stabilityCheck="never" >
        <MenuProvider>

          <Navigation />
        </MenuProvider>
      </Provider>
    </SafeAreaProvider>
  );
};