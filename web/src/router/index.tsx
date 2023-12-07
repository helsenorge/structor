import React from "react";
import { Route, Routes } from "react-router-dom";

import FrontPage from "../views/FrontPage";
import { TreeContextProvider } from "../store/treeStore/treeStore";

export default function GetRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/static_skjemabygger/" element={<TreeContextProvider><FrontPage /></TreeContextProvider>} />
    </Routes>
  );
}
