import { useContext, useMemo } from "react";

import {
  Button as AriaButton,
  DropIndicator,
  GridList,
  GridListItem,
  useDragAndDrop,
} from "react-aria-components";
import { useTranslation } from "react-i18next";
import "./OptionReference.css";

import {
  IExtensionType,
  IItemProperty,
} from "../../../types/IQuestionnareItemType";
import type { QuestionnaireItem } from "fhir/r4";

import Button from "@helsenorge/designsystem-react/components/Button";

import createUUID from "../../../helpers/CreateUUID";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import InputField from "../../InputField/inputField";

type Props = {
  item: QuestionnaireItem;
};

const OptionReference = ({ item }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const dispatchNewItem = (): void => {
    const newItem = [
      {
        url: IExtensionType.optionReference,
        valueReference: {
          reference: "",
          display: "",
          id: createUUID(),
        },
      },
    ];

    if (item.linkId) {
      dispatch(
        updateItemAction(item.linkId, IItemProperty.extension, [
          ...(item.extension || []),
          ...newItem,
        ]),
      );
    }
  };

  const removeItem = (id?: string): void => {
    if (id) {
      const newExtension =
        item.extension?.filter((x) => x.valueReference?.id !== id) || [];
      dispatch(
        updateItemAction(item.linkId, IItemProperty.extension, [
          ...newExtension,
        ]),
      );
    }
  };

  const updateReference = (
    type: "display" | "reference",
    value: string,
    id?: string,
  ): void => {
    const newExtension = item?.extension?.map((x) => {
      return x.valueReference?.id === id
        ? {
            url: x.url,
            valueReference: {
              ...x.valueReference,
              [type]: value,
            },
          }
        : x;
    });

    if (newExtension) {
      dispatch(
        updateItemAction(item.linkId, IItemProperty.extension, newExtension),
      );
    }
  };

  const optionReferences = item.extension?.filter(
    (x) => x.url === IExtensionType.optionReference,
  );

  const handleReorder = (e: {
    keys: Set<React.Key>;
    target: { key: React.Key; dropPosition: string };
  }): void => {
    if (!item.extension) {
      return;
    }

    const keys = [...e.keys];

    const nonOptionReferences = item.extension.filter(
      (x) => x.url !== IExtensionType.optionReference,
    );
    const currentOptionReferences = item.extension.filter(
      (x) => x.url === IExtensionType.optionReference,
    );

    const sourceIndex = currentOptionReferences.findIndex(
      (x) => x.valueReference?.id === keys[0],
    );
    const targetIndex = currentOptionReferences.findIndex(
      (x) => x.valueReference?.id === e.target.key,
    );

    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }

    const updatedReferences = [...currentOptionReferences];
    const [movedItem] = updatedReferences.splice(sourceIndex, 1);

    if (e.target.dropPosition === "before") {
      updatedReferences.splice(targetIndex, 0, movedItem);
    } else if (e.target.dropPosition === "after") {
      updatedReferences.splice(targetIndex + 1, 0, movedItem);
    }

    dispatch(
      updateItemAction(item.linkId, IItemProperty.extension, [
        ...nonOptionReferences,
        ...updatedReferences,
      ]),
    );
  };

  const listItems = useMemo(
    () =>
      (optionReferences || []).map((reference) => ({
        id: reference.valueReference?.id || createUUID(),
        reference,
      })),
    [optionReferences],
  );

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
    acceptedDragTypes: ["text/plain"],
    onReorder: handleReorder,
    renderDropIndicator(target) {
      return <DropIndicator target={target} />;
    },
  });

  return (
    <>
      <GridList
        aria-label="Reorderable option references"
        items={listItems}
        dragAndDropHooks={dragAndDropHooks}
        selectionMode="none"
        disallowTypeAhead
        renderEmptyState={() => <div>{t("No recipients")}</div>}
      >
        {({ id, reference }) => (
          <GridListItem
            id={id}
            textValue={
              reference.valueReference?.display ||
              reference.valueReference?.reference ||
              `Reference ${id}`
            }
          >
            <div className="option-reference align-everything">
              <AriaButton
                slot="drag"
                className="drag-handle"
                aria-label="reorder element"
              >
                {"☰"}
              </AriaButton>
              <InputField
                name="beskrivelse"
                placeholder={t("Select recipient..")}
                defaultValue={reference.valueReference?.display}
                onKeyDown={(event) => event.stopPropagation()}
                onBlur={(event) =>
                  updateReference(
                    "display",
                    event.target.value,
                    reference.valueReference?.id,
                  )
                }
              />
              <InputField
                name="verdi"
                placeholder={t("Select endpoint..")}
                defaultValue={reference.valueReference?.reference}
                onKeyDown={(event) => event.stopPropagation()}
                onBlur={(event) =>
                  updateReference(
                    "reference",
                    event.target.value,
                    reference.valueReference?.id,
                  )
                }
              />
              {(optionReferences?.length || 0) > 2 && (
                <button
                  type="button"
                  name="Fjern element"
                  aria-label={t("Remove element")}
                  title={t("Remove element")}
                  className="align-everything"
                  onClick={() => removeItem(reference.valueReference?.id)}
                />
              )}
            </div>
          </GridListItem>
        )}
      </GridList>
      <div className="center-text new-option-reference">
        <Button onClick={() => dispatchNewItem()} variant="outline">
          {t("+ Add recipient")}
        </Button>
      </div>
    </>
  );
};

export default OptionReference;
