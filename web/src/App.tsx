import "./components/Refero/styles/refero.scss";

import "./App.css";

import { setDefaultOptions } from "date-fns";
import { nb } from "date-fns/locale";
import { RouterProvider } from "react-router-dom";

import { ValidationProvider } from "./contexts/validation/ValidationContextProvider";
import routes from "./router/index";
import { TreeContextProvider } from "./store/treeStore/treeStore";
setDefaultOptions({ locale: nb });
function App(): JSX.Element {
  return (
    <TreeContextProvider>
      <ValidationProvider>
        <RouterProvider router={routes} />
      </ValidationProvider>
    </TreeContextProvider>
  );
}

export default App;
