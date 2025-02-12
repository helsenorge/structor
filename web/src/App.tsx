import "./components/Refero/styles/refero.scss";

import "./App.css";

import { BrowserRouter as Router } from "react-router-dom";

import GetRoutes from "./router/index";

function App(): JSX.Element {
  return (
    <Router>
      <GetRoutes />
    </Router>
  );
}

export default App;
