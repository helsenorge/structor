import { memo } from "react";

import { TreeItem, TreeItemContent } from "react-aria-components";

import type { Items, MarkedItem } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";

import TreeItemChildren from "./TreeItemChildren";
import { TreeItemContentRenderer } from "./TreeItemContentRenderer/TreeItemContentRenderer";

import styles from "./TreeView.module.scss";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TreeItemsProps {
  node: TreeNode;
  qItems: Items;
  parentPath: string[];
  isTopItem: boolean;
  depth: number;
  isLast: boolean;
  ancestorContinuations: boolean[];
  validationClasses: (linkId: string) => string;
  qCurrentItem: MarkedItem | undefined;
}

interface TreeItemClassNameProps {
  nodeId: string;
  isTopItem: boolean;
  isSelected: boolean;
}

const buildTreeItemClassName = ({
  isTopItem,
  isSelected,
}: TreeItemClassNameProps): string =>
  [
    styles.item,
    isTopItem ? styles.topItem : "",
    isSelected ? styles.itemSelected : "",
  ]
    .filter(Boolean)
    .join(" ");

// ─── TreeItems ────────────────────────────────────────────────────────────────

export const TreeItems = memo(function TreeItems({
  node,
  qItems,
  parentPath,
  isTopItem,
  depth,
  isLast,
  ancestorContinuations,
  validationClasses,
  qCurrentItem,
}: TreeItemsProps): React.JSX.Element {
  const item = qItems[node.id];
  const isSelected = qCurrentItem?.linkId === node.id;

  return (
    <TreeItem
      id={node.id}
      textValue={item?.text || item?.linkId || node.id}
      hasChildItems={node.children.length > 0}
      className={buildTreeItemClassName({
        nodeId: node.id,
        isTopItem,
        isSelected,
      })}
    >
      <TreeItemContent>
        {({ isExpanded, isDropTarget }) => (
          <TreeItemContentRenderer
            node={node}
            item={item}
            parentPath={parentPath}
            depth={depth}
            isLast={isLast}
            ancestorContinuations={ancestorContinuations}
            isExpanded={isExpanded}
            isDropTarget={isDropTarget}
            validationClassName={validationClasses(node.id)}
          />
        )}
      </TreeItemContent>

      <TreeItemChildren
        node={node}
        qItems={qItems}
        parentPath={parentPath}
        depth={depth}
        ancestorContinuations={ancestorContinuations}
        validationClasses={validationClasses}
        qCurrentItem={qCurrentItem}
      />
    </TreeItem>
  );
});
