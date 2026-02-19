import { useContext, useState } from "react";

import { useTranslation } from "react-i18next";
import UriFieldFr from "src/components/FormField/UriFieldFr";
import createUUID from "src/helpers/CreateUUID";
import { removeSpace } from "src/helpers/formatHelper";
import { updateFhirResourceAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

import type { ValueSet } from "fhir/r4";

import Button from "@helsenorge/designsystem-react/components/Button";
import FormGroup from "@helsenorge/designsystem-react/components/FormGroup";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlusSmall from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import Save from "@helsenorge/designsystem-react/components/Icons/Save";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import { IconButton } from "@helsenorge/designsystem-react/components/ListEditMode";

import { ExistingBasicValueSets } from "./ExistingBasicValueSets";
import { initValueSet } from "./utils";

import styles from "./simpleValueset.module.scss";

const SimpleValuesetPage = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const [newValueSet, setNewValueSet] = useState<ValueSet>({
    ...initValueSet(),
  });

  const addNewElement = (): void => {
    newValueSet?.compose?.include[0].concept?.push({
      id: createUUID(),
      code: "",
      display: "",
    });
    setNewValueSet({ ...newValueSet });
  };

  const removeElement = (id?: string): void => {
    const compose = { ...newValueSet.compose };
    const conceptToDelete =
      compose.include &&
      compose.include[0].concept?.findIndex((x) => x && x.id === id);
    if (conceptToDelete || conceptToDelete === 0) {
      if (compose.include) {
        compose.include[0].concept?.splice(conceptToDelete, 1);
      }
    }

    setNewValueSet({ ...newValueSet });
  };

  const handleConceptItem = (
    value: string,
    updateField: "code" | "display",
    id?: string,
    eventType: "blur" | "change" = "change",
  ): void => {
    const compose = { ...newValueSet.compose };
    const item =
      compose.include &&
      compose.include[0]?.concept?.find((x) => x && x.id === id);

    if (item) {
      item[updateField] = value;
    }

    if (updateField === "display" && item) {
      if (
        item.code === undefined ||
        (item.code === "" && eventType === "blur")
      ) {
        item.code = removeSpace(value);
      }
    }

    setNewValueSet({ ...newValueSet });
  };

  const dispatchValueSet = (): void => {
    dispatch(updateFhirResourceAction(newValueSet));
    setNewValueSet({ ...initValueSet() });
  };

  const handleSystem = (value: string): void => {
    const compose = { ...newValueSet.compose };
    if (compose.include) {
      compose.include[0].system = value;
    }
    setNewValueSet({ ...newValueSet });
  };

  return (
    <div className={styles["predefined-container"]}>
      <div>
        <FormGroup className={styles.formGroup}>
          <Label
            labelTexts={[
              {
                text: t("Title"),
              },
            ]}
          />
          <Input
            value={newValueSet.title}
            onChange={(event) =>
              setNewValueSet({ ...newValueSet, title: event.target.value })
            }
          />
        </FormGroup>
        <FormGroup className={styles.formGroup}>
          <Label
            labelTexts={[
              {
                text: t("Name"),
              },
            ]}
          />
          <Input
            value={newValueSet.name}
            onChange={(event) =>
              setNewValueSet({ ...newValueSet, name: event.target.value })
            }
          />
        </FormGroup>

        <FormGroup className={styles.formGroup}>
          <Label
            labelTexts={[
              {
                text: t("Publisher"),
              },
            ]}
          />
          <Input
            value={newValueSet.publisher}
            onChange={(event) =>
              setNewValueSet({
                ...newValueSet,
                publisher: event.target.value,
              })
            }
          />
        </FormGroup>
        <div className={`${styles.btnGroup}`}>
          <Button onClick={addNewElement}>
            <Icon svgIcon={PlusSmall} /> {t("New option")}
          </Button>
          <Button onClick={dispatchValueSet}>
            <Icon svgIcon={Save} /> {t("Save ValueSet")}
          </Button>
        </div>
        <div className={styles.valueSet}>
          {newValueSet.compose?.include.map((include, includeIndex) => {
            return (
              <div key={include.system}>
                <FormGroup className={styles.formGroup}>
                  <UriFieldFr
                    disabled={includeIndex > 0}
                    value={include.system}
                    onBlur={(event) => handleSystem(event.target.value)}
                  />
                </FormGroup>
                <div>
                  {include.concept?.map((item) => {
                    return (
                      <div
                        className={`answer-option-item ${styles.answerOptionItem}`}
                        key={item.id}
                      >
                        <div className={styles.answerOptionContent}>
                          <Input
                            label={t("Display")}
                            disabled={includeIndex > 0}
                            value={item.display}
                            placeholder={t("Enter a display value..")}
                            onBlur={(event) =>
                              handleConceptItem(
                                event.target.value,
                                "display",
                                item.id,
                                "blur",
                              )
                            }
                            onChange={(event) =>
                              handleConceptItem(
                                event.target.value,
                                "display",
                                item.id,
                                "change",
                              )
                            }
                          />
                          <Input
                            label={t("Code")}
                            disabled={includeIndex > 0}
                            value={item.code}
                            placeholder={t("Enter a code value..")}
                            onChange={(event) =>
                              handleConceptItem(
                                event.target.value,
                                "code",
                                item.id,
                              )
                            }
                          />
                        </div>
                        {includeIndex === 0 &&
                          include.concept?.length &&
                          include.concept?.length > 2 && (
                            <IconButton
                              icon={TrashCan}
                              onClick={() => removeElement(item.id)}
                              color="red"
                              ariaLabel="remove item"
                            />
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ExistingBasicValueSets setNewValueSet={setNewValueSet} />
    </div>
  );
};

export default SimpleValuesetPage;
