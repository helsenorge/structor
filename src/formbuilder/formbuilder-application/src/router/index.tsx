import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';

import Index from '../views/index';
import CreateForm from '../views/createForm';

export default function Routes() {
    return (
        <Switch>
            <Route path="/" exact>
                {' '}
                <Index />
            </Route>
            <Route path="/create-form">
                <CreateForm />
            </Route>
        </Switch>
    );
}
