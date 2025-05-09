import "./components/Refero/styles/refero.scss";

import "./App.css";

import { HashRouter as Router } from "react-router-dom";

import GetRoutes from "./router/index";
import { TreeContextProvider } from "./store/treeStore/treeStore";

function App(): JSX.Element {
  return (
    <TreeContextProvider>
      <Router>
        <GetRoutes />
      </Router>
    </TreeContextProvider>
  );
}

export default App;
