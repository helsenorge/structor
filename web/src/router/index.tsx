import React from "react";

import { createHashRouter, Navigate } from "react-router-dom";
import FormBuilder from "src/views/FormBuilder";
import FrontPage from "src/views/FrontPage";
import PageWrapper from "src/views/pageWrapper/PageWrapper";
import ValueSets from "src/views/valueSets";
import { ValueSetProvider } from "src/views/valueSets/context/ValueSetContextProvider";

export default createHashRouter([
  { path: "/", element: <FrontPage /> },
  {
    path: "/formbuilder",
    element: (
      <PageWrapper>
        <FormBuilder />
      </PageWrapper>
    ),
  },
  {
    path: "/formbuilder/:id",
    element: (
      <PageWrapper>
        <FormBuilder />
      </PageWrapper>
    ),
  },
  {
    // This is the parent layout route
    path: "/formbuilder/:id/valuesets",
    element: (
      <PageWrapper>
        <ValueSetProvider>
          <ValueSets />
        </ValueSetProvider>
      </PageWrapper>
    ),
    // The children are the tabs
    children: [
      {
        index: true,
        element: <Navigate to="new" replace />,
      },
      {
        path: "new",
        element: <ValueSets />,
      },
      {
        path: "existing",
        element: <ValueSets />,
      },
      {
        path: "import",
        element: <ValueSets />,
      },
      {
        path: "upload",
        element: <ValueSets />,
      },
    ],
  },
]);
