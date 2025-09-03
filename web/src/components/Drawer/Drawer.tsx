import React, { forwardRef, ReactNode, useRef, Ref } from "react";

import { useTranslation } from "react-i18next";

import "./Drawer.css";
import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import X from "@helsenorge/designsystem-react/components/Icons/X";

import useOutsideClick from "../../hooks/useOutsideClick";
type DrawerProps = {
  position: "left" | "right";
  visible: boolean;
  hide: () => void;
  title?: string;
  children?: ReactNode;
};

const Drawer = (
  props: DrawerProps,
  ref?: Ref<HTMLDivElement>,
): React.JSX.Element => {
  const { t } = useTranslation();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(drawerRef, props.hide, !props.visible);

  const open = props.visible ? "open" : "";
  const classNames = `drawer ${props.position}-drawer ${open}`;

  return (
    <>
      {props.visible && <div className="overlay" />}
      <div className={classNames} ref={ref || drawerRef}>
        <div className="drawer-header">
          <Button
            ariaLabel={t("Close (Esc)")}
            onClick={props.hide}
            variant="borderless"
            className="close-button"
          >
            <Icon color="white" svgIcon={X} />
          </Button>
          {props.title && <h1>{props.title}</h1>}
        </div>
        {props.children}
      </div>
    </>
  );
};

const ForwardedDrawer = forwardRef(Drawer);
export default ForwardedDrawer;
