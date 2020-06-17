import React from 'react';
import { Router } from 'react-router-dom';
import history from '../src/router/history'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router history={history} />
    </div>
  );
}

export default App;
