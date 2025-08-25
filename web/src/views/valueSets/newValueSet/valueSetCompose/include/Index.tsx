import React from "react";

import { useTranslation } from "react-i18next";
import IdInput from "src/components/extensions/valueInputs/IdInput";
import UriFieldFr from "src/components/FormField/UriFieldFr";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import { Concepts } from "./concept/Index";
import IncludeFilter from "./filter/IncludeFilter";
import { ImportCodeSystem } from "./importCodeSystem/Index";
import useValueSetInclude from "./useValueSetInclude";

import styles from "./valueSetComposeInclude.module.scss";
const Include = (): React.JSX.Element => {
  const { t } = useTranslation();
  const {
    handleUpdateValue,
    addNewElement,
    removeInclude,
    addNewInclude,
    include,
  } = useValueSetInclude();

  return (
    <div className={styles.valueSetInclude}>
      <Button
        variant="borderless"
        onClick={addNewInclude}
        ariaLabel={t("Add include")}
        className={styles.addNewIncludeButton}
      >
        <Icon svgIcon={PlussIcon} />
        {t("Add include")}
      </Button>
      <ImportCodeSystem />
      {include?.map((include, includeIndex) => {
        return (
          <div
            className={styles.includeContainer}
            key={include.id || includeIndex}
          >
            <div>
              <div className={styles.includeHeader}>
                <IdInput value={include.id} />
                <UriFieldFr
                  label={t("System")}
                  value={include.system}
                  onBlur={(event) =>
                    handleUpdateValue(
                      event.target.value,
                      includeIndex,
                      "system",
                    )
                  }
                />
                <Input
                  label={<Label labelTexts={[{ text: t("Version") }]} />}
                  value={include.version}
                  onChange={(event) =>
                    handleUpdateValue(
                      event.target.value,
                      includeIndex,
                      "version",
                    )
                  }
                />
              </div>
              <IncludeFilter
                item={include.filter}
                includeIndex={includeIndex}
              />

              <div>
                <Button
                  onClick={() => addNewElement(includeIndex)}
                  variant="borderless"
                  ariaLabel={t("Add concept")}
                >
                  <Icon svgIcon={PlussIcon} />
                  {t("Add concept")}
                </Button>
                <Concepts
                  concepts={include.concept}
                  includeIndex={includeIndex}
                />
              </div>
            </div>
            <div className={styles.deleteButtonContainer}>
              <Button
                variant="borderless"
                onClick={() => removeInclude(includeIndex)}
                ariaLabel={t("Remove include")}
                concept="destructive"
              >
                <Icon svgIcon={RemoveIcon} />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Include;
