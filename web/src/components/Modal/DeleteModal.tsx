import React, { useState, MouseEvent } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { useNavigation } from "react-router-dom";
import { deleteItemAction } from "src/store/treeStore/treeActions";
import { ActionType } from "src/store/treeStore/treeStore";

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
    return `item-button ${showLabel ? "item-button--visible" : ""}`;
  };

  const onClickButton = (event: MouseEvent<HTMLButtonElement>): void => {
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
      <button
        className={getClassNames()}
        onClick={onClickButton}
        aria-label="Delete element"
        title={t("Delete")}
      >
        <i className="trash-icon" />
        {showLabel && <label>{t("Delete")}</label>}
      </button>
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
