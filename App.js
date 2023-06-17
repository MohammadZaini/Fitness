import Navigation from "./src/infratructure/navigation";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function App() {
  return (
    <Provider store={store} >
      <Navigation />
    </Provider>
  );
}


