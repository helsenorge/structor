import { useMemo } from "react";

import {
  GridList,
  GridListItem,
  Button,
  DropIndicator,
  useDragAndDrop,
} from "react-aria-components";

import {
  IExtensionType,
  IItemProperty,
} from "../../types/IQuestionnareItemType";
import type { QuestionnaireItem, QuestionnaireItemAnswerOption } from "fhir/r4";

import AnswerOption from "./AnswerOption";
import {
  removeExtensionFromSingleAnswerOption,
  removeOptionFromAnswerOptionArray,
  updateAnswerOption,
  updateAnswerOptionCode,
  updateAnswerOptionExtension,
} from "../../helpers/answerOptionHelper";

import "./DraggableAnswerOptions.css";

interface DraggableAnswerOptionsProps {
  item: QuestionnaireItem;
  dispatchUpdateItem: (
    name: IItemProperty,
    value:
      | string
      | boolean
      | QuestionnaireItemAnswerOption[]
      | Element
      | undefined,
  ) => void;
}

const DraggableAnswerOptions = ({
  item,
  dispatchUpdateItem,
}: DraggableAnswerOptionsProps): React.JSX.Element => {
  // Transform answerOptions to list items with keys
  const listItems = useMemo(
    () =>
      (item.answerOption ?? []).map((option) => ({
        id: option.valueCoding?.id ?? "",
        answerOption: option,
      })),
    [item.answerOption],
  );

  const { dragAndDropHooks } = useDragAndDrop({
    // Enable reordering within the list
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": key })),
    acceptedDragTypes: ["text/plain"],
    onReorder(e) {
      const keys = Array.from(e.keys);

      if (e.target.dropPosition === "before") {
        // Find indices for reordering
        const targetIndex = listItems.findIndex((i) => i.id === e.target.key);
        const sourceIndices = keys.map((key) =>
          listItems.findIndex((i) => i.id === key),
        );

        // Perform reorder
        const newOptions = [...(item.answerOption ?? [])];
        const [movedItem] = newOptions.splice(sourceIndices[0], 1);
        newOptions.splice(targetIndex, 0, movedItem);

        dispatchUpdateItem(IItemProperty.answerOption, newOptions);
      } else if (e.target.dropPosition === "after") {
        const targetIndex = listItems.findIndex((i) => i.id === e.target.key);
        const sourceIndices = keys.map((key) =>
          listItems.findIndex((i) => i.id === key),
        );

        const newOptions = [...(item.answerOption ?? [])];
        const [movedItem] = newOptions.splice(sourceIndices[0], 1);
        newOptions.splice(targetIndex + 1, 0, movedItem);

        dispatchUpdateItem(IItemProperty.answerOption, newOptions);
      }
    },
  });

  return (
    <GridList
      aria-label="Answer options"
      items={listItems}
      dragAndDropHooks={dragAndDropHooks}
      className="draggable-answer-options"
      renderDropIndicator={(target) => <DropIndicator target={target} />}
    >
      {(listItem) => (
        <GridListItem
          id={listItem.id}
          textValue={listItem.answerOption.valueCoding?.display ?? ""}
          className="draggable-answer-option"
        >
          <Button slot="drag" className="drag-handle">
            {"☰"}
          </Button>
          <div className="answer-option-content">
            <AnswerOption
              item={item}
              changeDisplay={(event) => {
                const newArray = updateAnswerOption(
                  item.answerOption ?? [],
                  listItem.answerOption.valueCoding?.id ?? "",
                  event.target.value,
                );
                dispatchUpdateItem(IItemProperty.answerOption, newArray);
              }}
              changeCode={(event) => {
                const newArray = updateAnswerOptionCode(
                  item.answerOption ?? [],
                  listItem.answerOption.valueCoding?.id ?? "",
                  event.target.value,
                );
                dispatchUpdateItem(IItemProperty.answerOption, newArray);
              }}
              changeOrdinalValueExtension={(event) => {
                if (event.target.value === "") {
                  const newArray = removeExtensionFromSingleAnswerOption(
                    item.answerOption ?? [],
                    listItem.answerOption.valueCoding?.id ?? "",
                    IExtensionType.ordinalValue,
                  );
                  dispatchUpdateItem(IItemProperty.answerOption, newArray);
                } else {
                  const newArray = updateAnswerOptionExtension(
                    item.answerOption ?? [],
                    listItem.answerOption.valueCoding?.id ?? "",
                    event.target.value,
                    IExtensionType.ordinalValue,
                  );
                  dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }
              }}
              changeValueSetLabel={(event) => {
                if (event.target.value === "") {
                  const newArray = removeExtensionFromSingleAnswerOption(
                    item.answerOption || [],
                    listItem.answerOption.valueCoding?.id || "",
                    IExtensionType.valueSetLabel,
                  );
                  dispatchUpdateItem(IItemProperty.answerOption, newArray);
                } else {
                  const newArray = updateAnswerOptionExtension(
                    item.answerOption || [],
                    listItem.answerOption.valueCoding?.id || "",
                    event.target.value,
                    IExtensionType.valueSetLabel,
                  );
                  dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }
              }}
              deleteItem={() => {
                const newArray = removeOptionFromAnswerOptionArray(
                  item.answerOption ?? [],
                  listItem.answerOption.valueCoding?.id ?? "",
                );
                dispatchUpdateItem(IItemProperty.answerOption, newArray);
              }}
              answerOption={listItem.answerOption}
              showDelete={
                !!item.answerOption?.length && item.answerOption?.length > 2
              }
            />
          </div>
        </GridListItem>
      )}
    </GridList>
  );
};

export default DraggableAnswerOptions;
