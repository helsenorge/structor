import React from "react";

import { useTranslation } from "react-i18next";
import UriFieldFr from "src/components/FormField/UriFieldFr";
import createUUID from "src/helpers/CreateUUID";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import { Concepts } from "./concept/Index";
import IncludeFilter from "./filter/IncludeFilter";
import { ImportCodeSystem } from "./importCodeSystem/Index";
import { useValueSetContext } from "../../../context/useValueSetContext";
import { initialComposeInclude } from "../../../utils/intialValuesets";

import styles from "./valueSetComposeInclude.module.scss";
const Include = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { newValueSet, setNewValueSet } = useValueSetContext();

  const addNewInclude = (): void => {
    setNewValueSet((prevState) => ({
      ...prevState,
      compose: {
        ...prevState.compose,
        include: [
          ...(prevState.compose?.include || []),
          initialComposeInclude(),
        ],
      },
    }));
  };
  const removeInclude = (includeIndex: number): void => {
    setNewValueSet((prevState) => {
      const updatedInclude =
        prevState.compose?.include?.filter(
          (_, index) => index !== includeIndex,
        ) || [];
      return {
        ...prevState,
        compose: {
          ...prevState.compose,
          include: updatedInclude,
        },
      };
    });
  };

  const handleSystem = (
    value: string,
    includeIndex: number,
    key: "system" | "version",
  ): void => {
    const compose = { ...newValueSet.compose };
    compose.include && (compose.include[includeIndex][key] = value);
    setNewValueSet({ ...newValueSet });
  };

  const addNewElement = (includeIndex = 0): void => {
    const newValueSetCopy = { ...newValueSet };
    if (newValueSetCopy.compose?.include?.[includeIndex]?.concept) {
      newValueSetCopy.compose.include[includeIndex].concept?.push({
        id: createUUID(),
        code: "",
        display: "",
      });
    } else if (newValueSetCopy.compose?.include?.[includeIndex]) {
      newValueSetCopy.compose.include[includeIndex].concept = [
        {
          id: createUUID(),
          code: "",
          display: "",
        },
      ];
    }
    setNewValueSet({ ...newValueSetCopy });
  };

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
      {newValueSet.compose?.include.map((include, includeIndex) => {
        return (
          <div
            className={styles.includeContainer}
            key={include.id || includeIndex}
          >
            <div>
              <div className={styles.includeHeader}>
                <UriFieldFr
                  label={t("System")}
                  value={include.system}
                  onBlur={(event) =>
                    handleSystem(event.target.value, includeIndex, "system")
                  }
                />
                <Input
                  label={<Label labelTexts={[{ text: t("Version") }]} />}
                  value={include.version}
                  onChange={(event) =>
                    handleSystem(event.target.value, includeIndex, "version")
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
                  ariaLabel="Add concept"
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
