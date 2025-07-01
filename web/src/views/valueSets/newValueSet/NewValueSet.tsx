import React, { useContext } from "react";

import { ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { useScrollToElement } from "src/hooks/useScrollToElement";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Refresh from "@helsenorge/designsystem-react/components/Icons/Refresh";
import Save from "@helsenorge/designsystem-react/components/Icons/Save";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import {
  updateValueSetAction,
  removeValueSet,
} from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import { useValueSetContext } from "../context/useValueSetContext";
import ValuseSetCompose from "../valueSetCompose/ValuseSetCompose";

import styles from "./new-value-set.module.scss";

type Props = {
  scrollToTarget: () => void;
};
const NewValueSet = ({ scrollToTarget }: Props): React.JSX.Element => {
  const { t } = useTranslation();

  const {
    dispatch,
    state: { qContained },
  } = useContext(TreeContext);
  const { newValueSet, setNewValueSet, reset } = useValueSetContext();

  const startNewValueSet = (): void => {
    reset();
    scrollToTarget();
  };
  const dispatchValueSet = (): void => {
    dispatch(updateValueSetAction(newValueSet));
    scrollToTarget();
  };
  const dispatchDeleteValueSet = (): void => {
    if (newValueSet.id) {
      dispatch(removeValueSet(newValueSet));
      reset();
      scrollToTarget();
    }
  };
  const isNewValueSet =
    !newValueSet.id || !qContained?.some((x) => x.id === newValueSet.id);
  return (
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
        <Button variant="outline" onClick={startNewValueSet}>
          <Icon svgIcon={Refresh} />

          {t("Reset")}
        </Button>
        {!isNewValueSet && (
          <Button
            variant="fill"
            concept="destructive"
            onClick={dispatchDeleteValueSet}
          >
            <Icon svgIcon={TrashCan} />

            {t("Delete")}
          </Button>
        )}
      </div>
    </div>
  );
};
export default NewValueSet;
