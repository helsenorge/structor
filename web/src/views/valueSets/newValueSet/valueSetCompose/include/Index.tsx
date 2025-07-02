import React from "react";

import { Extension, ValueSetComposeInclude } from "fhir/r4";
import { useTranslation } from "react-i18next";
import UriFieldFr from "src/components/FormField/UriFieldFr";
import createUUID from "src/helpers/CreateUUID";

import Button from "@helsenorge/designsystem-react/components/Button";
import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlussIcon from "@helsenorge/designsystem-react/components/Icons/PlusSmall";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Tabs from "@helsenorge/designsystem-react/components/Tabs";

import Details from "./details/index";
import { Extensions } from "../../../../../components/extensions/Extensions";
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

  const handleSystem = (value: string, includeIndex: number): void => {
    const compose = { ...newValueSet.compose };
    compose.include && (compose.include[includeIndex].system = value);
    setNewValueSet({ ...newValueSet });
  };
  const updateExtensions = (
    extensions: Extension[],
    id: string,
    idType: "linkId" | "id" = "id",
  ): void => {
    setNewValueSet((prevState) => {
      const updatedInclude =
        prevState.compose?.include?.map((inc) => {
          if (idType === "id" && inc.id === id) {
            return { ...inc, extension: extensions };
          }
          const concepts =
            inc.concept?.map((concept) => {
              if (concept.id === id) {
                return { ...concept, extension: extensions };
              }
              return concept;
            }) || [];
          return { ...inc, concept: concepts };
        }) || [];

      return {
        ...prevState,
        compose: {
          ...prevState.compose,
          include: updatedInclude,
        },
      };
    });
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
  const expanderTitle = (
    include: ValueSetComposeInclude,
    index: number,
  ): string =>
    include.system
      ? `${include.system} - item (${index + 1})`
      : t("New include");
  return (
    <div className={styles.valueSetInclude}>
      <Button
        variant="borderless"
        onClick={addNewInclude}
        ariaLabel={t("Add new include")}
        className={styles.addNewIncludeButton}
      >
        <Icon svgIcon={PlussIcon} />
        {t("Add new include")}
      </Button>
      <ExpanderList childPadding color="white">
        {newValueSet.compose?.include.map((include, includeIndex) => {
          return (
            <ExpanderList.Expander
              key={include.system || includeIndex}
              expanded={includeIndex === 0}
              title={expanderTitle(include, includeIndex)}
            >
              <div>
                <div className={styles.includeHeader}>
                  <UriFieldFr
                    label={t("System")}
                    value={include.system}
                    onBlur={(event) =>
                      handleSystem(event.target.value, includeIndex)
                    }
                  />
                  {newValueSet?.compose?.include &&
                    newValueSet?.compose?.include.length > 1 && (
                      <Button
                        variant="borderless"
                        onClick={() => removeInclude(includeIndex)}
                        ariaLabel={t("Remove include")}
                      >
                        <Icon svgIcon={RemoveIcon} />
                      </Button>
                    )}
                </div>
                <div>
                  <Button
                    onClick={() => addNewElement(includeIndex)}
                    variant="borderless"
                    ariaLabel="Add new option"
                  >
                    {t("Add new item")}
                    <Icon svgIcon={PlussIcon} />
                  </Button>
                  {include.concept?.map((item, index) => {
                    return (
                      <Tabs
                        key={item.id || index}
                        className={styles.valueSetTabs}
                      >
                        <Tabs.Tab title="Details">
                          <Details
                            item={item}
                            index={index}
                            includeIndex={includeIndex}
                            hasMoreThanOneConcept={
                              !!include.concept?.length &&
                              include.concept?.length > 1
                            }
                          />
                        </Tabs.Tab>
                        <Tabs.Tab title="Extensions">
                          <div className={styles.extensionsContainer}>
                            <Extensions
                              idType="id"
                              id={item.id || ""}
                              key={item.id || index}
                              extensions={item.extension}
                              updateExtensions={updateExtensions}
                              className={styles.composeIncludeExtensions}
                            />
                          </div>
                        </Tabs.Tab>
                      </Tabs>
                    );
                  })}
                </div>
              </div>
            </ExpanderList.Expander>
          );
        })}
      </ExpanderList>
    </div>
  );
};
export default Include;
