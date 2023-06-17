import Navigation from "./src/infratructure/navigation";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useFonts, Oswald_400Regular } from '@expo-google-fonts/oswald';
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function App() {
  AsyncStorage.clear()
  const [oswaldLoaded] = useFonts({
    Oswald_400Regular,
  });

  if (!oswaldLoaded) {
    return null;
  };

  return (
    <Provider store={store} >
      <Navigation />
    </Provider>
  );
};