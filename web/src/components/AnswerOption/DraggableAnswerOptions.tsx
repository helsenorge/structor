import { useRef, useState } from "react";

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
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(
    null,
  );
  const dragCounterRef = useRef(0);

  const options = item.answerOption ?? [];

  const handleDragStart = (index: number, e: React.DragEvent): void => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragEnter = (index: number): void => {
    dragCounterRef.current++;
    setDropTargetIndex(index);
  };

  const handleDragLeave = (): void => {
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setDropTargetIndex(null);
      setDropPosition(null);
    }
  };

  const handleDragOver = (index: number, e: React.DragEvent): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDropPosition(e.clientY < midY ? "before" : "after");
    setDropTargetIndex(index);
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent): void => {
    e.preventDefault();
    dragCounterRef.current = 0;

    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
    const rect = e.currentTarget.getBoundingClientRect();
    const insertAfter = e.clientY >= rect.top + rect.height / 2;

    setDropTargetIndex(null);
    setDropPosition(null);
    setDragIndex(null);

    if (sourceIndex === targetIndex) return;

    const newOptions = [...options];
    const [movedItem] = newOptions.splice(sourceIndex, 1);
    // Adjust target index after removal
    let insertIndex = insertAfter ? targetIndex : targetIndex;
    if (sourceIndex < targetIndex) {
      insertIndex = insertAfter ? targetIndex : targetIndex - 1;
    }
    newOptions.splice(insertIndex, 0, movedItem);
    dispatchUpdateItem(IItemProperty.answerOption, newOptions);
  };

  const handleDragEnd = (): void => {
    dragCounterRef.current = 0;
    setDragIndex(null);
    setDropTargetIndex(null);
    setDropPosition(null);
  };

  return (
    <div className="draggable-answer-options">
      {options.map((option, index) => {
        const optionId = option.valueCoding?.id ?? "";
        const isDragging = dragIndex === index;
        const isDropTarget = dropTargetIndex === index && dragIndex !== index;

        let className = "draggable-answer-option";
        if (isDragging) className += " dragging";
        if (isDropTarget) {
          className += " drop-target";
          if (dropPosition === "before") className += " drop-before";
          if (dropPosition === "after") className += " drop-after";
        }

        return (
          <div
            key={optionId}
            className={className}
            draggable
            onDragStart={(e) => handleDragStart(index, e)}
            onDragEnter={() => handleDragEnter(index)}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => handleDragOver(index, e)}
            onDrop={(e) => handleDrop(index, e)}
            onDragEnd={handleDragEnd}
          >
            <span className="drag-handle">{"☰"}</span>
            <div className="answer-option-content">
              <AnswerOption
                item={item}
                changeDisplay={(event) => {
                  const newArray = updateAnswerOption(
                    options,
                    optionId,
                    event.target.value,
                  );
                  dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
                changeCode={(event) => {
                  const newArray = updateAnswerOptionCode(
                    options,
                    optionId,
                    event.target.value,
                  );
                  dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
                changeOrdinalValueExtension={(event) => {
                  if (event.target.value === "") {
                    const newArray = removeExtensionFromSingleAnswerOption(
                      options,
                      optionId,
                      IExtensionType.ordinalValue,
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                  } else {
                    const newArray = updateAnswerOptionExtension(
                      options,
                      optionId,
                      event.target.value,
                      IExtensionType.ordinalValue,
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                  }
                }}
                changeValueSetLabel={(event) => {
                  if (event.target.value === "") {
                    const newArray = removeExtensionFromSingleAnswerOption(
                      options,
                      optionId,
                      IExtensionType.valueSetLabel,
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                  } else {
                    const newArray = updateAnswerOptionExtension(
                      options,
                      optionId,
                      event.target.value,
                      IExtensionType.valueSetLabel,
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                  }
                }}
                deleteItem={() => {
                  const newArray = removeOptionFromAnswerOptionArray(
                    options,
                    optionId,
                  );
                  dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
                answerOption={option}
                showDelete={options.length > 2}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DraggableAnswerOptions;
