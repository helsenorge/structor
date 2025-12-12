import { DeleteButton } from "src/components/Modal/DeleteModal";

import type { ActionType } from "../../../store/treeStore/treeStore";
import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "i18next";
import "./ItemButtons.css";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Copy from "@helsenorge/designsystem-react/components/Icons/Copy";

import { duplicateItemAction } from "../../../store/treeStore/treeActions";

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
