import React from "react";

import { Extension, ValueSetCompose } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { Extensions } from "src/components/extensions/Extensions";
import IdInput from "src/components/valueInputs/IdInput";
import createUUID from "src/helpers/CreateUUID";
import { createUriUUID } from "src/helpers/uriHelper";
import { toIsoOrUndefined } from "src/utils/dateUtils";

import Button from "@helsenorge/designsystem-react/components/Button";
import Checkbox from "@helsenorge/designsystem-react/components/Checkbox";
import Label from "@helsenorge/designsystem-react/components/Label";
import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import DatePicker from "@helsenorge/datepicker/components/DatePicker";

import ValueSetComposeExclude from "./exclude/Index";
import Include from "./include/Index";
import { useValueSetContext } from "../../context/useValueSetContext";

import styles from "./valueSetCompose.module.scss";
const ValueSetComposeComponent = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { newValueSet, setNewValueSet } = useValueSetContext();
  function handleComposeItem(
    value: boolean | string | undefined,
    updateField: keyof Pick<ValueSetCompose, "inactive" | "lockedDate">,
  ): void {
    setNewValueSet({
      ...newValueSet,
      compose: {
        ...newValueSet?.compose,
        id: newValueSet?.compose?.id || createUUID(),
        include: newValueSet?.compose?.include || [],
        [updateField]: value,
      },
    });
  }
  const handleUpdateComposeExtensions = (extension: Extension[]): void => {
    setNewValueSet({
      ...newValueSet,
      compose: {
        ...newValueSet?.compose,
        id: newValueSet?.compose?.id || createUUID(),
        include: newValueSet?.compose?.include || [],
        extension: extension,
      },
    });
  };

  return (
    <div>
      <div className={styles.valueSetComposeDetails}>
        <IdInput value={newValueSet?.compose?.id} />
        <Checkbox
          label={<Label labelTexts={[{ text: t("Inactive") }]} />}
          checked={newValueSet?.compose?.inactive}
          onChange={(event) =>
            handleComposeItem(event.target.checked, "inactive")
          }
        ></Checkbox>

        <DatePicker
          label={<Label labelTexts={[{ text: "LockedDate" }]} />}
          dateValue={
            newValueSet?.compose?.lockedDate
              ? new Date(newValueSet?.compose?.lockedDate)
              : undefined
          }
          footerContent={
            <Button
              onClick={() => handleComposeItem(undefined, "lockedDate")}
              variant="borderless"
            >
              {"clear"}
            </Button>
          }
          variant="positionautomatic"
          onChange={(_e, next) =>
            handleComposeItem(toIsoOrUndefined(next), "lockedDate")
          }
        />
      </div>
      <Extensions
        id={newValueSet?.compose?.id || createUriUUID()}
        updateExtensions={handleUpdateComposeExtensions}
        extensions={newValueSet?.compose?.extension}
        idType="id"
        buttonText={t("Add extension")}
        className={styles.extensions}
        borderType="full"
      />
      <Tabs
        ariaLabelLeftButton="Scroll left"
        ariaLabelRightButton="Scroll right"
        sticky
        className={styles.valueSetCompose}
      >
        <Tabs.Tab title={"Include"}>
          <Include />
        </Tabs.Tab>
        <Tabs.Tab title={"Exclude"}>
          <ValueSetComposeExclude />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};
export default ValueSetComposeComponent;
