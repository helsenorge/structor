import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FormBuilder from '../views/FormBuilder';
import { TreeContextProvider } from '../store/treeStore/treeStore';
import Login from '../views/Login';

export default function Routes(): JSX.Element {
    return (
        <Switch>
            <Route path="/" exact>
                <TreeContextProvider>
                    <FormBuilder />
                </TreeContextProvider>
            </Route>
            <Route path="/login" exact>
                <Login />
            </Route>
        </Switch>
    );
}
