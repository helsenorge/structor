import { DropIndicator } from "react-aria-components";

import type { Items } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";
import type { DropTarget } from "@react-types/shared";

import { IndentRenderer } from "../IndentRenderer/IndentRenderer";
import ItemButtons from "../ItemButtons/ItemButtons";
import { TreeItemIcon } from "../TreeView/TreeItemIcon";

import styles from "./DropIndicatorRenderer.module.scss";

interface DropIndicatorRendererProps {
  target: DropTarget;
  parentPathById: Map<string, string[]>;
  draggedNode?: TreeNode | null;
  qItems?: Items;
}

type CssVarStyle = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

const TREE_INDENT_UNIT_PX = 24;

const GhostNode = ({
  node,
  qItems,
  depth,
  isLast,
  ancestorContinuations,
}: {
  node: TreeNode;
  qItems: Items;
  depth: number;
  isLast: boolean;
  ancestorContinuations: boolean[];
}): JSX.Element => {
  const item = qItems[node.id];
  const isGroup = item?.type === "group";
  return (
    <div>
      <div className={styles.ghostRow}>
        {depth > 0 && (
          <IndentRenderer
            nodeId={node.id}
            ancestorContinuations={ancestorContinuations}
            isLast={isLast}
          />
        )}
        <div
          className={`${styles.ghostItem} ${isGroup ? styles.ghostItemGroup : ""}`}
        >
          <TreeItemIcon type={item?.type} />
          <span className={styles.ghostHierarchy}>{node.hierarchy}</span>
          <span className={styles.ghostText}>{item?.text || node.id}</span>
          <div className={styles.ghostActions}>
            <ItemButtons item={item} parentArray={[]} showLabel={false} />
          </div>
        </div>
      </div>
      {node.children.map((child, index) => {
        const childIsLast = index === node.children.length - 1;
        return (
          <GhostNode
            key={child.id}
            node={child}
            qItems={qItems}
            depth={depth + 1}
            isLast={childIsLast}
            ancestorContinuations={[...ancestorContinuations, !childIsLast]}
          />
        );
      })}
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
  const dropIndicatorClassKey = `dropIndicator--${dropPosition}`;
  const dropIndicatorStyle: CssVarStyle = {
    "--drop-indent": `${dropIndentPx}px`,
    "--tree-item-level": depth,
  };

  const showGhost = draggedNode && qItems && dropPosition !== "on";

  return (
    <DropIndicator
      target={target}
      className={`${styles.dropIndicator} ${styles[dropIndicatorClassKey]}`}
      style={dropIndicatorStyle}
      data-depth={depth}
    >
      {showGhost ? (
        <div className={styles.ghostPreview}>
          <GhostNode
            node={draggedNode}
            qItems={qItems}
            depth={0}
            isLast={true}
            ancestorContinuations={[]}
          />
        </div>
      ) : (
        dropPosition !== "on" && (
          <div className={styles.previewRow}>
            <div className={styles.previewDragHandle} aria-hidden="true">
              <span className={styles.previewDots} />
            </div>
            <span className={styles.previewPlaceholder}>
              {`Nytt element her (nivå ${depth})`}
            </span>
          </div>
        )
      )}
    </DropIndicator>
  );
};
