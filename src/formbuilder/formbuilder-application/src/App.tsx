import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '../src/router/index';
import './App.css';

function App(): JSX.Element {
    return (
        <div className="App">
            <Router>
                <Routes />
            </Router>
        </div>
    );
}

export default App;
