import { createHashRouter, Navigate } from "react-router";
import CodeSystems from "src/views/codeSystems";
import { CodeSystemProvider } from "src/views/codeSystems/context/CodeSystemContextProvider";
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
    path: "/formbuilder/:id/valuesets",
    element: (
      <PageWrapper>
        <ValueSetProvider>
          <ValueSets />
        </ValueSetProvider>
      </PageWrapper>
    ),
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
        path: "upload",
        element: <ValueSets />,
      },
      {
        path: "*",
        element: <ValueSets />,
      },
    ],
  },
  {
    path: "/formbuilder/:id/codesystems",
    element: (
      <PageWrapper>
        <CodeSystemProvider>
          <CodeSystems />
        </CodeSystemProvider>
      </PageWrapper>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="new" replace />,
      },
      {
        path: "new",
        element: <CodeSystems />,
      },
      {
        path: "existing",
        element: <CodeSystems />,
      },
      {
        path: "upload",
        element: <CodeSystems />,
      },
      {
        path: "*",
        element: <CodeSystems />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <PageWrapper>
        <></>
      </PageWrapper>
    ),
  },
]);
