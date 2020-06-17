import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import Index from '../views/index';
import CreateForm from '../views/createForm';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/create-form" component={CreateForm} />
    </Switch>
  );
}
