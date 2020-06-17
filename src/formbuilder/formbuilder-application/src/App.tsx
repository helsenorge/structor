import React from 'react';
import {  BrowserRouter as  Router, Switch, Route } from 'react-router-dom';
import Routes from '../src/router/index'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes /> 
      </Router>
    </div>
  );
}

export default App;
