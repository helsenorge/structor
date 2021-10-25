import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FrontPage from '../views/FrontPage';
import { TreeContextProvider } from '../store/treeStore/treeStore';
import Login from '../views/Login';
import Code from '../views/Code';

export default function Routes(): JSX.Element {
    return (
        <Switch>
            <Route path="/" exact>
                <TreeContextProvider>
                    <FrontPage />
                </TreeContextProvider>
            </Route>
            <Route path="/login" exact>
                <Login />
            </Route>
            <Route path="/code" exact>
                <Code />
            </Route>
        </Switch>
    );
}
