import { DropIndicator } from "react-aria-components";

import type { Items } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";
import type { DropTarget } from "@react-types/shared";

import styles from "./DropIndicatorRenderer.module.scss";

interface DropIndicatorRendererProps {
  target: DropTarget;
  parentPathById: Map<string, string[]>;
  draggedNode?: TreeNode | null;
  qItems?: Items;
}

const TREE_INDENT_UNIT_PX = 24;

const GhostNode = ({
  node,
  qItems,
  depth,
}: {
  node: TreeNode;
  qItems: Items;
  depth: number;
}): JSX.Element => {
  const item = qItems[node.id];
  const isGroup = item?.type === "group";
  return (
    <div>
      <div
        className={`${styles.ghostItem} ${isGroup ? styles.ghostItemGroup : ""}`}
        style={{ marginLeft: depth * TREE_INDENT_UNIT_PX }}
      >
        <span className={styles.ghostHierarchy}>{node.hierarchy}</span>
        <span className={styles.ghostText}>{item?.text || node.id}</span>
      </div>
      {node.children.map((child) => (
        <GhostNode
          key={child.id}
          node={child}
          qItems={qItems}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

export const DropIndicatorRenderer = ({
  target,
  parentPathById,
  draggedNode,
  qItems,
}: DropIndicatorRendererProps): JSX.Element => {
  const isItemTarget = target.type === "item";
  const dropPosition = isItemTarget ? target.dropPosition : "after";
  const key = isItemTarget ? String(target.key) : null;

  const parentPath = key ? (parentPathById.get(key) ?? []) : [];
  const depth =
    dropPosition === "on" ? parentPath.length + 1 : parentPath.length;
  const dropIndentPx = depth * TREE_INDENT_UNIT_PX;

  const showGhost = draggedNode && qItems && dropPosition !== "on";

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
    >
      {showGhost ? (
        <div className={styles.ghostPreview}>
          <GhostNode node={draggedNode} qItems={qItems} depth={0} />
        </div>
      ) : (
        dropPosition !== "on" && (
          <div className={styles.previewRow}>
            <div className={styles.previewDragHandle} aria-hidden="true">
              <span className={styles.previewDots} />
            </div>
            <span className={styles.previewPlaceholder}>
              Nytt element her (nivå {depth})
            </span>
          </div>
        )
      )}
    </DropIndicator>
  );
};
