import React from "react";

import { Route, Routes } from "react-router-dom";
import FormBuilder from "src/views/FormBuilder";
import FrontPage from "src/views/FrontPage";

export default function GetRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/formbuilder" element={<FormBuilder />} />
      <Route path="/formbuilder/:id" element={<FormBuilder />} />
    </Routes>
  );
}
