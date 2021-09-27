import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '../src/router/index';

function App(): JSX.Element {
    return (
        <Router>
            <Routes />
        </Router>
    );
}

export default App;
