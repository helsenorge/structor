import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import Button from "@helsenorge/designsystem-react/components/Button";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

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
          <Input
            value={newValueSet.title}
            onChange={(event) =>
              setNewValueSet({ ...newValueSet, title: event.target.value })
            }
            label={<Label labelTexts={[{ text: t("Title") }]} />}
          />
          <Input
            value={newValueSet.name}
            onChange={(event) =>
              setNewValueSet({ ...newValueSet, name: event.target.value })
            }
            label={<Label labelTexts={[{ text: t("Teknisk-navn") }]} />}
          />
          <Input
            value={newValueSet.publisher}
            onChange={(event) =>
              setNewValueSet({ ...newValueSet, publisher: event.target.value })
            }
            label={<Label labelTexts={[{ text: t("Publisher") }]} />}
          />

          <ValuseSetCompose />
          <div className="btn-group center-text">
            <Button onClick={addNewElement}>{t("+ New option")}</Button>
            <Button variant="outline" onClick={dispatchValueSet}>
              {t("Save Value Set")}
            </Button>
          </div>
        </div>
        <ExistingValueSets />
      </div>
    </section>
  );
};
export default ValueSets;
