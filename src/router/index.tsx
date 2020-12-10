import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Index from '../views/index';
import CreateForm from '../views/Form';
import TreeForm from '../views/treeForm';
import FormBuilder from '../views/FormBuilder';
import { FormContextProvider } from '../store/FormStore';
import { TreeContextProvider } from '../store/treeStore/treeStore';
import MainMenu from '../views/MainMenu';

export default function Routes(): JSX.Element {
    return (
        <Switch>
            <Route path="/" exact>
                <MainMenu />
            </Route>
            <Route path="/old-menu" exact>
                <FormContextProvider>
                    <Index />
                </FormContextProvider>
            </Route>
            <Route path="/create-form" exact>
                <FormContextProvider>
                    <CreateForm />
                </FormContextProvider>
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
        </Switch>
    );
}
