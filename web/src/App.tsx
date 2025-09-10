import "./components/Refero/styles/refero.scss";

import "./App.css";

import { RouterProvider } from "react-router";

import routes from "./router/index";
import { TreeContextProvider } from "./store/treeStore/treeStore";

function App(): JSX.Element {
  return (
    <TreeContextProvider>
      <RouterProvider router={routes} />
    </TreeContextProvider>
  );
}

export default App;
