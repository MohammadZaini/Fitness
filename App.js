import Navigation from "./src/infratructure/navigation";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useFonts, Oswald_400Regular } from '@expo-google-fonts/oswald';

export default function App() {

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
}


