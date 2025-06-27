import React, { useContext } from "react";

import { useTranslation } from "react-i18next";
import Btn from "src/components/Btn/Btn";
import FormField from "src/components/FormField/FormField";
import InputField from "src/components/InputField/inputField";

import { useValueSetContext } from "./context/useValueSetContext";
import ExistingValueSets from "./existinValueSets/ExistingValueSets";
import ValuseSetCompose from "./valueSetCompose/ValuseSetCompose";
import createUUID from "../../helpers/CreateUUID";
import { updateValueSetAction } from "../../store/treeStore/treeActions";
import { TreeContext } from "../../store/treeStore/treeStore";
import "./valueSets.css";

const ValueSets = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const { newValueSet, setNewValueSet, reset } = useValueSetContext();

  const addNewElement = (): void => {
    newValueSet?.compose?.include[0].concept?.push({
      id: createUUID(),
      code: "",
      display: "",
    });
    setNewValueSet({ ...newValueSet });
  };

  const dispatchValueSet = (): void => {
    dispatch(updateValueSetAction(newValueSet));
    reset();
  };

  return (
    <section className="value-sets">
      <h1 className="value-sets--headline">{t("ValueSets")}</h1>
      <div className="predefined-container">
        <div>
          <h2>{"New Value Set"}</h2>

          <FormField label={t("Title")}>
            <InputField
              value={newValueSet.title}
              onChange={(event) =>
                setNewValueSet({ ...newValueSet, title: event.target.value })
              }
            />
          </FormField>
          <FormField label={t("Teknisk-navn")}>
            <InputField
              value={newValueSet.name}
              onChange={(event) =>
                setNewValueSet({ ...newValueSet, name: event.target.value })
              }
            />
          </FormField>
          <FormField label={t("Publisher")}>
            <InputField
              value={newValueSet.publisher}
              onChange={(event) =>
                setNewValueSet({
                  ...newValueSet,
                  publisher: event.target.value,
                })
              }
            />
          </FormField>
          <ValuseSetCompose />
          <div className="btn-group center-text">
            <Btn
              onClick={addNewElement}
              title={t("+ New option")}
              variant="secondary"
            />
            <Btn
              onClick={dispatchValueSet}
              title={t("Save >")}
              variant="primary"
            />
          </div>
        </div>
        <ExistingValueSets />
      </div>
      <pre className="json-container">
        {JSON.stringify(newValueSet, null, 2)}
      </pre>
    </section>
  );
};
export default ValueSets;
