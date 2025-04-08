import React, { MouseEvent } from "react";

import "./Btn.css";
import { BTN_ICONS, BTN_TYPES, BTN_VARIANTS } from "./types";

type BtnProps = {
  title: string;
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => void;
  id?: string;
  type?: (typeof BTN_TYPES)[keyof typeof BTN_TYPES];
  icon?: (typeof BTN_ICONS)[keyof typeof BTN_ICONS];
  variant?: (typeof BTN_VARIANTS)[keyof typeof BTN_VARIANTS];
  disabled?: boolean;
};

const Btn = ({
  title,
  onClick,
  id,
  type = "button",
  icon,
  variant,
  disabled,
}: BtnProps): React.JSX.Element => {
  return (
    <button
      type={type}
      className={`regular-btn ${variant}`}
      id={id}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={icon} />} {title}
    </button>
  );
};

export default Btn;
