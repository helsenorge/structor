import React, { useContext } from "react";

import { CodeSystem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import UriFieldFr from "src/components/FormField/UriFieldFr";
import createUUID from "src/helpers/CreateUUID";
import { TreeContext } from "src/store/treeStore/treeStore";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";

import { Concepts } from "./concept/Index";
import IncludeFilter from "./filter/IncludeFilter";
import { useValueSetContext } from "../../../context/useValueSetContext";
import { initialComposeInclude } from "../../../utils/intialValuesets";

import styles from "./valueSetComposeInclude.module.scss";
const Include = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);
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
  const handleImportCodeSystem = (codeSystemUrl: string): void => {
    setNewValueSet((prevState) => {
      const codeSystem: CodeSystem | undefined = state.qContained?.find(
        (item) =>
          item.resourceType === "CodeSystem" && item.url === codeSystemUrl,
      ) as CodeSystem;
      if (codeSystem) {
        return {
          ...prevState,
          compose: {
            ...prevState.compose,
            include: [
              ...(prevState.compose?.include || []),
              {
                system: codeSystem.url,
                concept: codeSystem.concept?.map((concept) => ({
                  id: concept.id,
                  code: concept.code,
                  display: concept.display,
                })),
              },
            ],
          },
        };
      }
      return prevState;
    });
  };
  const codeSystems = state.qContained?.filter(
    (item) => item.resourceType === "CodeSystem",
  );

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

      {codeSystems && codeSystems?.length > 0 && (
        <div className={styles.codeSystemsContainer}>
          <Label labelTexts={[{ text: t("Code systems") }]} />

          {codeSystems
            ?.filter((cs) => cs.url)
            ?.filter(
              (cs, index, self) =>
                index === self.findIndex((t) => t.url === cs.url),
            )
            ?.map((item) => (
              <div key={item.id} className={styles.codeSystemItem}>
                <span>{item.url}</span>
                <Button
                  disabled={newValueSet.compose?.include?.some(
                    (inc) => inc.system === item.url,
                  )}
                  variant="borderless"
                  onClick={() => handleImportCodeSystem(item.url!)}
                >
                  {t("Import")}
                </Button>
              </div>
            ))}
        </div>
      )}

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
