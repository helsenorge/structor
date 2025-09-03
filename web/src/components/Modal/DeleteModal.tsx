import React, { useState, MouseEvent } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { deleteItemAction } from "src/store/treeStore/treeActions";
import { ActionType } from "src/store/treeStore/treeStore";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import TrashCan from "@helsenorge/designsystem-react/components/Icons/TrashCan";

import Modal from "../Modal/Modal";

interface DeleteButtonProps {
  dispatch: React.Dispatch<ActionType>;
  item: QuestionnaireItem;
  parentArray: Array<string>;
  showLabel: boolean;
}

export const DeleteButton = ({
  dispatch,
  item,
  parentArray,
  showLabel,
}: DeleteButtonProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getClassNames = (): string => {
    return `${showLabel ? "item-button--visible" : ""}`;
  };

  const onClickButton = (): void => {
    setShowDeleteModal(!showDeleteModal);
  };

  const dispatchDeleteItem = (event?: MouseEvent<HTMLButtonElement>): void => {
    if (event) {
      event.stopPropagation();
      dispatch(deleteItemAction(item.linkId, parentArray));
    }
  };

  const onClose = (): void => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <>
      <Button
        className={getClassNames()}
        onClick={onClickButton}
        ariaLabel="Delete element"
        variant="borderless"
      >
        <Icon svgIcon={TrashCan} />
        {showLabel && <label>{t("Delete")}</label>}
      </Button>
      {showDeleteModal && (
        <Modal
          close={onClose}
          primary={dispatchDeleteItem}
          title={t("Delete")}
          buttonSecondaryText={t("Cancel")}
          buttonPrimaryText={t("Delete")}
        >
          <div className="modal-delete-msg">
            {t("Are you that you want to delete item {0} with LinkId {1}?")
              .replace("{0}", item.type)
              .replace("{1}", item.linkId)}
          </div>
        </Modal>
      )}
    </>
  );
};
