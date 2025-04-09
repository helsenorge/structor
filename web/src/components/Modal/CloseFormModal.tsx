import React from "react";

import { useTranslation } from "react-i18next";

import Modal from "./Modal";
import Btn from "../Btn/Btn";

interface CloseFormModalProps {
  setShowCloseFormModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCloseForm: React.Dispatch<React.SetStateAction<boolean>>;
  hideMenu: () => void;
}

const CloseFormModal = ({
  setShowCloseFormModal,
  setCloseForm,
  hideMenu,
}: CloseFormModalProps): React.JSX.Element => {
  const { t } = useTranslation();

  const closeModal = (): void => {
    setShowCloseFormModal(false);
    hideMenu();
  };

  return (
    <Modal title={t("Close form")} close={closeModal}>
      <div>
        <p>{t("Do you want to close the form without saving?")}</p>
        <div className="modal-btn-bottom">
          <div className="center-text">
            <Btn
              title={t("Yes")}
              type="button"
              variant="primary"
              onClick={() => setCloseForm(true)}
            />
            <Btn
              title={t("No")}
              type="button"
              variant="secondary"
              onClick={closeModal}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CloseFormModal;
