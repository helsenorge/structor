import React from "react";

import { Route, Routes } from "react-router-dom";

import { TreeContextProvider } from "../store/treeStore/treeStore";
import FrontPage from "../views/FrontPage";

export default function GetRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route
        path="/static_skjemabygger/"
        element={
          <TreeContextProvider>
            <FrontPage />
          </TreeContextProvider>
        }
      />
    </Routes>
  );
}
