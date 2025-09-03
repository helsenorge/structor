import React, { MouseEvent } from "react";

import { useTranslation } from "react-i18next";

import "./Modal.css";
import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import X from "@helsenorge/designsystem-react/components/Icons/X";

import Btn from "../Btn/Btn";

type Props = {
  close?: () => void;
  primary?: (event?: MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  children: React.JSX.Element | React.JSX.Element[];
  size?: "large" | "small";
  id?: string;
  buttonSecondaryText?: string;
  buttonPrimaryText?: string;
};

const Modal = ({
  close,
  primary,
  children,
  title,
  size = "small",
  id,
  buttonSecondaryText,
  buttonPrimaryText,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="overlay align-everything">
      <div className={`modal ${size}`} id={id}>
        <div className="title">
          <Button variant="borderless" ariaLabel={t("Close")} onClick={close}>
            <Icon color="white" svgIcon={X} />
          </Button>
          <h1>{title}</h1>
        </div>
        <div className="content">{children}</div>
        <div className="modal-btn-bottom">
          <div className="center-text">
            {buttonSecondaryText && (
              <Btn
                title={buttonSecondaryText}
                type="button"
                variant="secondary"
                onClick={close}
              />
            )}
            {buttonPrimaryText && (
              <Btn
                title={buttonPrimaryText}
                type="button"
                variant="primary"
                onClick={primary}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
