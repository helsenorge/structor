import { DropIndicator } from "react-aria-components";

import type { DropTarget } from "@react-types/shared";

import styles from "./DropIndicatorRenderer.module.scss";

interface DropIndicatorRendererProps {
  target: DropTarget;
  parentPathById: Map<string, string[]>;
}

const TREE_INDENT_UNIT_PX = 24;

export const DropIndicatorRenderer = ({
  target,
  parentPathById,
}: DropIndicatorRendererProps): JSX.Element => {
  const isItemTarget = target.type === "item";
  const dropPosition = isItemTarget ? target.dropPosition : "after";
  const key = isItemTarget ? String(target.key) : null;

  const parentPath = key ? (parentPathById.get(key) ?? []) : [];
  const depth =
    dropPosition === "on" ? parentPath.length + 1 : parentPath.length;
  const dropIndentPx = depth * TREE_INDENT_UNIT_PX;

  return (
    <DropIndicator
      target={target}
      className={`${styles.dropIndicator} ${styles[`dropIndicator--${dropPosition}`]}`}
      style={
        {
          "--drop-indent": `${dropIndentPx}px`,
          "--tree-item-level": depth,
        } as React.CSSProperties
      }
      data-depth={depth}
    />
  );
};
