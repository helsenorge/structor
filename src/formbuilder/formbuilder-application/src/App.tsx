import React from 'react';
import { Router } from 'react-router-dom';
import history from '../src/router/history'
import Routes from '../src/router/index'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Routes /> 
      </Router>
    </div>
  );
}

export default App;
