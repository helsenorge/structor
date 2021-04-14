import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import TreeForm from '../views/treeForm';
import FormBuilder from '../views/FormBuilder';
import { TreeContextProvider } from '../store/treeStore/treeStore';
import MainMenu from '../views/MainMenu';
import Login from '../views/Login';
import Code from '../views/Code';

export default function Routes(): JSX.Element {
    return (
        <Switch>
            <Route path="/" exact>
                <TreeContextProvider>
                    <MainMenu />
                </TreeContextProvider>
            </Route>
            <Route path="/tree-test" exact>
                <TreeContextProvider>
                    <TreeForm />
                </TreeContextProvider>
            </Route>
            <Route path="/new-create-form" exact>
                <TreeContextProvider>
                    <FormBuilder />
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
