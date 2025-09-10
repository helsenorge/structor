import React from "react";

import { createHashRouter } from "react-router";
import FormBuilder from "src/views/FormBuilder";
import FrontPage from "src/views/FrontPage";

export default createHashRouter([
  { path: "/", element: <FrontPage /> },
  { path: "/formbuilder", element: <FormBuilder /> },
  { path: "/formbuilder/:id", element: <FormBuilder /> },
]);
