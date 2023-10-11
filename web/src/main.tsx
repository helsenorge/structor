
// import './index.css';
// import './components/Refero/styles/refero.scss';

// window.global ||= window;

import './index.css';
import './components/Refero/styles/refero.scss';

import './App.css';

import "./init"

import App from "./App";
import React from "react";
import ReactDOM from "react-dom";

import { UserProvider } from "./contexts/UserContext";
import "./helpers/i18n";

const container = document.getElementById('root');
container?.classList.add('root');

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  container
);
