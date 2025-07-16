import React, { MouseEvent } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import { DeleteButton } from "src/components/Modal/DeleteModal";

import { duplicateItemAction } from "../../../store/treeStore/treeActions";
import { ActionType } from "../../../store/treeStore/treeStore";

import "./ItemButtons.css";

export const generateItemButtons = (
  t: TFunction<"translation">,
  item: QuestionnaireItem | undefined,
  parentArray: Array<string>,
  showLabel: boolean,
  dispatch: React.Dispatch<ActionType>,
): React.JSX.Element[] => {
  if (!item) {
    return [];
  }

  const dispatchDuplicateItem = (
    event: MouseEvent<HTMLButtonElement>,
  ): void => {
    event.stopPropagation();
    dispatch(duplicateItemAction(item.linkId, parentArray));
  };

  const getClassNames = (): string => {
    return `item-button ${showLabel ? "item-button--visible" : ""}`;
  };

  return [
    <button
      key="duplicate-item-button"
      className={getClassNames()}
      onClick={dispatchDuplicateItem}
      aria-label="Duplicate element"
      title={t("Duplicate")}
    >
      <i className="duplicate-icon" />
      {showLabel && <label>{t("Duplicate")}</label>}
    </button>,
    <DeleteButton
      dispatch={dispatch}
      item={item}
      parentArray={parentArray}
      showLabel={showLabel}
      key={"delete-item-button"}
    />,
  ];
};
