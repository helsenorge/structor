import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Index from '../views/index';
import CreateForm from '../views/Form';
import { FormContextProvider } from '../store/FormStore';

export default function Routes(): JSX.Element {
    return (
        <Switch>
            <Route path="/" exact>
                <FormContextProvider>
                    <Index />
                </FormContextProvider>
            </Route>
            <Route path="/create-form" exact>
                <FormContextProvider>
                    <CreateForm />
                </FormContextProvider>
            </Route>
        </Switch>
    );
}
