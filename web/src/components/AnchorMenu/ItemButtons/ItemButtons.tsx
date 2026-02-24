import { useContext } from "react";

import { useTranslation } from "react-i18next";
import { DeleteButton } from "src/components/Modal/DeleteModal";

import type { QuestionnaireItem } from "fhir/r4";

import "./ItemButtons.css";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import Copy from "@helsenorge/designsystem-react/components/Icons/Copy";

import { duplicateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";

type Props = {
  item: QuestionnaireItem | undefined;
  parentArray: string[];
  showLabel: boolean;
};
export const ItemButtons = ({
  item,
  parentArray,
  showLabel,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  if (!item) {
    return <></>;
  }

  const getClassNames = (): string => {
    return `${showLabel ? "visible" : ""}`;
  };

  return (
    <>
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
      </Button>
      <DeleteButton
        dispatch={dispatch}
        item={item}
        parentArray={parentArray}
        showLabel={showLabel}
        key={"delete-item-button"}
      />
    </>
  );
};
export default ItemButtons;
