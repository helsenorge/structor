import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';

import Index from '../views/index';
import CreateForm from '../views/Form';
import Preview from '../views/Preview';
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
            <Route path="/preview" exact>
                <FormContextProvider>
                    <Preview />
                </FormContextProvider>
            </Route>
        </Switch>
    );
}
