import { GridListItem } from "react-aria-components";
import { useTranslation } from "react-i18next";

import type { ToolboxNode } from "../types";

import { IconSize } from "@helsenorge/designsystem-react/components/Icon";

import { DragHandle } from "../DragHandle/DragHandle";
import { TreeItemIcon } from "../TreeView/TreeItemIcon";

import styles from "./Toolbox.module.scss";

interface ToolboxItemProps {
  item: ToolboxNode;
}

export const ToolboxItem = ({ item }: ToolboxItemProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <GridListItem
      id={item.id}
      textValue={item.label}
      className={styles.dragComponent}
    >
      <DragHandle
        ariaLabel={t("Drag")}
        variant="toolbox"
        className={styles.srOnly}
      />
      <TreeItemIcon type={item.type} size={IconSize.XXSmall} />
      <span className={styles.label}>{item.label}</span>
    </GridListItem>
  );
};
