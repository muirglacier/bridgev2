import "./App.css";
import CBridgeTransferWidget from "./cBridgeTransferWidget";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <CBridgeTransferWidget />
      </Provider>
    </div>
  );
}

export default App;
