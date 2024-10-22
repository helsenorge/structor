
import './components/Refero/styles/refero.scss';
import './App.css';
import "./init"
import App from "./App";
import React from "react";
import {createRoot} from "react-dom/client";

import { UserProvider } from "./contexts/UserContext";
import "./helpers/i18n";

const anchor = document.getElementById('root');
anchor?.classList.add('root');

if (!anchor) {
  throw new Error("No element with id 'main-content-wrapper' found.");
}

const root = createRoot(anchor);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
);

