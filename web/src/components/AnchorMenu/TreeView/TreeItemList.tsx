import { memo } from "react";

import type { Items, MarkedItem } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";

import { TreeItems } from "./TreeItems";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TreeItemsListProps {
  nodes: TreeNode[];
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  parentPathById: Map<string, string[]>;
  validationClasses: (linkId: string) => string;
  ancestorContinuations?: boolean[];
}

// ─── TreeItemsList ────────────────────────────────────────────────────────────

export const TreeItemsList = memo(function TreeItemsList({
  nodes,
  qItems,
  qCurrentItem,
  parentPathById,
  validationClasses,
  ancestorContinuations = [],
}: TreeItemsListProps): React.JSX.Element {
  return (
    <>
      {nodes.map((node, index) => {
        const parentPath = parentPathById.get(node.id) ?? [];
        const isLast = index === nodes.length - 1;

        return (
          <TreeItems
            key={node.id}
            node={node}
            qItems={qItems}
            parentPath={parentPath}
            isTopItem={parentPath.length === 0}
            depth={ancestorContinuations.length}
            isLast={isLast}
            ancestorContinuations={ancestorContinuations}
            validationClasses={validationClasses}
            qCurrentItem={qCurrentItem}
          />
        );
      })}
    </>
  );
});
