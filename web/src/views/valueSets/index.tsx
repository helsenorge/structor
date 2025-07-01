import React, { useContext } from "react";

import { ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";
import UriFieldFr from "src/components/FormField/UriFieldFr";
import { createUriUUID } from "src/helpers/uriHelper";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Refresh from "@helsenorge/designsystem-react/components/Icons/Refresh";
import Save from "@helsenorge/designsystem-react/components/Icons/Save";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import { useValueSetContext } from "./context/useValueSetContext";
import ExistingValueSets from "./existinValueSets/ExistingValueSets";
import ValuseSetCompose from "./valueSetCompose/ValuseSetCompose";
import {
  updateValueSetAction,
  removeValueSet,
} from "../../store/treeStore/treeActions";
import { TreeContext } from "../../store/treeStore/treeStore";

import styles from "./valueSets.module.scss";
const valueSetUri = createUriUUID();
const ValueSets = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const { newValueSet, setNewValueSet, reset } = useValueSetContext();

  const dispatchValueSet = (): void => {
    dispatch(updateValueSetAction(newValueSet));
    reset();
  };
  const dispatchDeleteValueSet = (): void => {
    if (newValueSet.id) {
      dispatch(removeValueSet(newValueSet));
      reset();
    }
  };
  return (
    <section className={styles.valueSets}>
      <h1 className={styles.valueSetsHeadline}>{t("ValueSets")}</h1>
      <div className={styles.predefinedContainer}>
        <div>
          <h2>{t("New Value Set")}</h2>
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
          <Input
            value={newValueSet.version}
            onChange={(event) =>
              setNewValueSet({ ...newValueSet, version: event.target.value })
            }
            label={<Label labelTexts={[{ text: t("Version") }]} />}
          />
          <Input
            value={newValueSet.url}
            onChange={(event) =>
              setNewValueSet({ ...newValueSet, url: event.target.value })
            }
            label="Url"
          />
          <Select
            label={t("Type")}
            value={newValueSet.status || "draft"}
            onChange={(event) =>
              setNewValueSet({
                ...newValueSet,
                status: event.target.value as ValueSet["status"],
              })
            }
          >
            <option value="draft">{"Draft"}</option>
            <option value="active">{"Active"}</option>
            <option value="retired">{"Retired"}</option>
            <option value="unknown">{"Unknown"}</option>
          </Select>
          <br />
          <ValuseSetCompose />
          <hr className={styles.devider} />
          <div className="btn-group center-text">
            <Button variant="outline" onClick={dispatchValueSet}>
              <Icon svgIcon={Save} />

              {t("Save")}
            </Button>
            <Button variant="outline" onClick={reset}>
              <Icon svgIcon={Refresh} />

              {t("Reset")}
            </Button>
            <Button
              variant="fill"
              concept="destructive"
              onClick={dispatchDeleteValueSet}
            >
              <Icon svgIcon={TrashCan} />

              {t("Delete")}
            </Button>
          </div>
        </div>
        <ExistingValueSets />
      </div>
    </section>
  );
};
export default ValueSets;
