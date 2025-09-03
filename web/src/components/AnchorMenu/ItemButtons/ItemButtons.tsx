import React from "react";

import { QuestionnaireItem } from "fhir/r4";
import { TFunction } from "react-i18next";
import "./ItemButtons.css";
import { DeleteButton } from "src/components/Modal/DeleteModal";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Copy from "@helsenorge/designsystem-react/components/Icons/Copy";

import { duplicateItemAction } from "../../../store/treeStore/treeActions";
import { ActionType } from "../../../store/treeStore/treeStore";

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

  const getClassNames = (): string => {
    return `${showLabel ? "visible" : ""}`;
  };

  return [
    <Button
      key="duplicate-item-button"
      className={getClassNames()}
      onClick={(event): void => {
        event?.stopPropagation();
        dispatch(duplicateItemAction(item.linkId, parentArray));
      }}
      ariaLabel={t("Duplicate")}
      size="medium"
      variant="borderless"
    >
      <Icon svgIcon={Copy} />
      {showLabel && t("Duplicate")}
    </Button>,
    <DeleteButton
      dispatch={dispatch}
      item={item}
      parentArray={parentArray}
      showLabel={showLabel}
      key={"delete-item-button"}
    />,
  ];
};
