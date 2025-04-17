import React, { HTMLAttributes } from "react";
import "./icon-button.css";

interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  title?: string;
}

const IconButton = ({
  children,
  title,
  ...btnProps
}: IconButtonProps): React.JSX.Element => (
  <button
    className="mui-icon-button"
    aria-label={title}
    title={title}
    {...btnProps}
  >
    {children}
  </button>
);

export default IconButton;
