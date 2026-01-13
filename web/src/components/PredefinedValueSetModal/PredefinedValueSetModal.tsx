import { useContext, useMemo, useState } from "react";

import {
  Button,
  DropIndicator,
  GridList,
  GridListItem,
  useDragAndDrop,
} from "react-aria-components";
import { useTranslation } from "react-i18next";
import { getValueSetsFromState } from "src/store/treeStore/selectors";

import { predefinedValueSetUri } from "../../types/IQuestionnareItemType";
import type { ValueSet } from "fhir/r4";

import createUUID from "../../helpers/CreateUUID";
import { removeSpace } from "../../helpers/formatHelper";
import { createUriUUID } from "../../helpers/uriHelper";
import { getValueSetValues } from "../../helpers/valueSetHelper";
import { updateFhirResourceAction } from "../../store/treeStore/treeActions";
import { TreeContext } from "../../store/treeStore/treeStore";
import Btn from "../Btn/Btn";
import FormField from "../FormField/FormField";
import UriField from "../FormField/UriField";
import InputField from "../InputField/inputField";
import Modal from "../Modal/Modal";
import "./PredefinedValueSetModal.css";

type ReorderEvent = Parameters<
  NonNullable<Parameters<typeof useDragAndDrop>[0]["onReorder"]>
>[0];

type Props = {
  close: () => void;
  onSaved?: (valueSet: ValueSet) => void;
};

const initValueSet = (): ValueSet =>
  ({
    resourceType: "ValueSet",
    id: `${createUUID()}`,
    version: "1.0",
    name: "",
    title: "",
    date: new Date().toISOString(),
    status: "draft",
    publisher: "",
    compose: {
      include: [
        {
          system: createUriUUID(),
          concept: [
            {
              id: createUUID(),
              code: "",
              display: "",
            },
            {
              id: createUUID(),
              code: "",
              display: "",
            },
          ],
        },
      ],
    },
  }) as ValueSet;

const PredefinedValueSetModal = (props: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);
  const [newValueSet, setNewValueSet] = useState<ValueSet>({
    ...initValueSet(),
  });

  const valueSets = getValueSetsFromState(state);
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
    const savedValueSet = JSON.parse(JSON.stringify(newValueSet)) as ValueSet;
    dispatch(updateFhirResourceAction(savedValueSet));
    props.onSaved?.(savedValueSet);
    setNewValueSet({ ...initValueSet() });
  };

  const handleOrder = (e: ReorderEvent): void => {
    if (!newValueSet.compose?.include[0].concept) return;

    const keys = [...e.keys];
    const concepts = newValueSet.compose.include[0].concept;

    const sourceIndex = concepts.findIndex((item) => item.id === keys[0]);
    const targetIndex = concepts.findIndex((item) => item.id === e.target.key);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const updatedConcepts = [...concepts];
    const [movedItem] = updatedConcepts.splice(sourceIndex, 1);

    if (e.target.dropPosition === "before") {
      updatedConcepts.splice(targetIndex, 0, movedItem);
    } else if (e.target.dropPosition === "after") {
      updatedConcepts.splice(targetIndex + 1, 0, movedItem);
    }

    const compose = { ...newValueSet.compose };
    if (compose.include) {
      compose.include[0].concept = updatedConcepts;
    }
    setNewValueSet({ ...newValueSet, compose });
  };

  const handleSystem = (value: string): void => {
    const compose = { ...newValueSet.compose };
    if (compose.include) {
      compose.include[0].system = value;
    }
    setNewValueSet({ ...newValueSet });
  };

  const canEdit = (type?: string): boolean => {
    return type !== predefinedValueSetUri;
  };

  const handleEdit = (valueSet: ValueSet): void => {
    const o = JSON.stringify(valueSet);
    setNewValueSet(JSON.parse(o));
  };

  return (
    <Modal
      close={props.close}
      title={t("Predefined values")}
      size="large"
      buttonSecondaryText={t("Close")}
    >
      <div className="predefined-container">
        <div>
          <FormField label={t("Title")}>
            <InputField
              value={newValueSet.title}
              onChange={(event) =>
                setNewValueSet({ ...newValueSet, title: event.target.value })
              }
            />
          </FormField>
          <FormField label={t("Teknisk-navn")}>
            <InputField
              value={newValueSet.name}
              onChange={(event) =>
                setNewValueSet({ ...newValueSet, name: event.target.value })
              }
            />
          </FormField>
          <FormField label={t("Publisher")}>
            <InputField
              value={newValueSet.publisher}
              onChange={(event) =>
                setNewValueSet({
                  ...newValueSet,
                  publisher: event.target.value,
                })
              }
            />
          </FormField>
          <div className="btn-group center-text">
            <Btn
              onClick={addNewElement}
              title={t("+ New option")}
              variant="secondary"
            />
            <Btn
              onClick={dispatchValueSet}
              title={t("Save >")}
              variant="primary"
            />
          </div>
          <div className="value-set">
            {newValueSet.compose?.include.map((include, includeIndex) => {
              return (
                <div key={include.system}>
                  <FormField label={t("System")}>
                    <UriField
                      disabled={includeIndex > 0}
                      value={include.system}
                      onBlur={(event) => handleSystem(event.target.value)}
                    />
                  </FormField>
                  <ConceptList
                    concepts={include.concept || []}
                    includeIndex={includeIndex}
                    onReorder={handleOrder}
                    onHandleConceptItem={handleConceptItem}
                    onRemoveElement={removeElement}
                    t={t}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div>
          {valueSets?.map((x) => (
            <div key={x.id}>
              <p>
                <strong>{`${x.title}`}</strong> {`(${x.name || x.id})`}
                {canEdit(x.url) && (
                  <Btn
                    title={t("Change")}
                    type="button"
                    variant="secondary"
                    onClick={() => handleEdit(x)}
                  />
                )}
              </p>
              <ul>
                {getValueSetValues(x).map((y) => (
                  <li key={y.code}>{`${y.display} (${y.code})`}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

type ConceptListProps = {
  concepts: Array<{ id?: string; code?: string; display?: string }>;
  includeIndex: number;
  onReorder: (e: ReorderEvent) => void;
  onHandleConceptItem: (
    value: string,
    field: "code" | "display",
    id?: string,
    eventType?: "blur" | "change",
  ) => void;
  onRemoveElement: (id?: string) => void;
  t: (key: string) => string;
};

const ConceptList = ({
  concepts,
  includeIndex,
  onReorder,
  onHandleConceptItem,
  onRemoveElement,
  t,
}: ConceptListProps): React.JSX.Element => {
  const listItems = useMemo(
    () =>
      concepts.map((item) => ({
        id: item.id || "",
        item,
      })),
    [concepts],
  );

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
    acceptedDragTypes: ["text/plain"],
    onReorder,
    renderDropIndicator(target) {
      return <DropIndicator target={target} />;
    },
  });

  return (
    <GridList
      aria-label="Reorderable concept list"
      items={listItems}
      dragAndDropHooks={dragAndDropHooks}
      selectionMode="none"
      renderEmptyState={() => <div>{t("No concepts")}</div>}
    >
      {({ id, item }) => (
        <GridListItem
          id={id}
          textValue={item.display || item.code || `Concept ${id}`}
          className="answer-option-item align-everything"
        >
          <Button
            slot="drag"
            className="drag-handle"
            aria-label="reorder element"
          >
            {"☰"}
          </Button>
          <div className="answer-option-content align-everything">
            <InputField
              disabled={includeIndex > 0}
              key={`${item.id}-display`}
              defaultValue={item.display}
              placeholder={t("Enter a title..")}
              onKeyDown={(event) => event.stopPropagation()}
              onBlur={(event) =>
                onHandleConceptItem(
                  event.target.value,
                  "display",
                  item.id,
                  "blur",
                )
              }
            />
            <InputField
              disabled={includeIndex > 0}
              key={`${item.id}-code`}
              defaultValue={item.code}
              placeholder={t("Enter a value..")}
              onKeyDown={(event) => event.stopPropagation()}
              onBlur={(event) =>
                onHandleConceptItem(event.target.value, "code", item.id, "blur")
              }
            />
          </div>
          {includeIndex === 0 && concepts.length > 2 && (
            <button
              type="button"
              onClick={() => onRemoveElement(item.id)}
              name={t("Remove element")}
              aria-label={t("Remove element")}
              title={t("Remove element")}
              className="align-everything"
            />
          )}
        </GridListItem>
      )}
    </GridList>
  );
};

export default PredefinedValueSetModal;
