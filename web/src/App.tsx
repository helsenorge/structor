 import './components/Refero/styles/refero.scss';

 import './App.css';

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import GetRoutes from "./router/index";

function App() {
  return (
    <>
      <Router>
        <GetRoutes></GetRoutes>
      </Router>
    </>
  );
}

export default App;
