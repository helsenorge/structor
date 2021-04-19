import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import TreeForm from '../views/treeForm';
import FormBuilder from '../views/FormBuilder';
import { TreeContextProvider } from '../store/treeStore/treeStore';
import MainMenu from '../views/MainMenu';
import FormBuilderWithDrawers from '../views/FormBuilderWithDrawers';

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
            <Route path="/create-form" exact>
                <TreeContextProvider>
                    <FormBuilderWithDrawers />
                </TreeContextProvider>
            </Route>
        </Switch>
    );
}
