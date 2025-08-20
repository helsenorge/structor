import React from "react";

import { ValueSetCompose } from "fhir/r4";
import { useTranslation } from "react-i18next";

import Checkbox from "@helsenorge/designsystem-react/components/Checkbox";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Tabs from "@helsenorge/designsystem-react/components/Tabs";

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
        include: newValueSet?.compose?.include || [],
        ...newValueSet?.compose,
        [updateField]: value,
      },
    });
  }
  return (
    <div>
      <div className={styles.valueSetComposeDetails}>
        <Checkbox
          label={<Label labelTexts={[{ text: t("Inactive") }]} />}
          checked={newValueSet?.compose?.inactive}
          onChange={(event) =>
            handleComposeItem(event.target.checked, "inactive")
          }
        ></Checkbox>
        <Input
          value={newValueSet?.compose?.lockedDate}
          onChange={(event) =>
            handleComposeItem(event.target.value, "lockedDate")
          }
          label={<Label labelTexts={[{ text: t("LockedDate") }]} />}
        />
      </div>
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
