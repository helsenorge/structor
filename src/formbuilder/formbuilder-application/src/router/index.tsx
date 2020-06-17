import React from "react";
import { Switch } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";

import index from '../views/index';
import createForm from '../views/createForm';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={index} />
      <Route path="/create-form" component={createForm} />
    </Switch>
  );
}
