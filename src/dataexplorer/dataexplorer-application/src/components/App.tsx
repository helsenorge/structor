import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard/Dashboard';

const App = () => (
    <Switch>
        <Route exact path="/" component={Dashboard} />
    </Switch>
);

export default App;
