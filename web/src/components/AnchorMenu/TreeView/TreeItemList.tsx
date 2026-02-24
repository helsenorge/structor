import type { Items, MarkedItem } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";
import type { Key } from "@react-types/shared";
import type { DragAndDropHooks } from "react-aria-components";

import { TreeItems } from "./TreeItems";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TreeViewProps {
  treeData: TreeNode[];
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  parentPathById: Map<string, string[]>;
  expandedKeys: Set<Key>;
  setExpandedKeys: (keys: Set<Key>) => void;
  dragAndDropHooks: DragAndDropHooks;
  onSelectionChange: (keys: Set<Key>) => void;
  validationClasses: (linkId: string) => string;
  showPlaceholder: boolean;
}

interface TreeItemsListProps {
  nodes: TreeNode[];
  qItems: Items;
  qCurrentItem: MarkedItem | undefined;
  parentPathById: Map<string, string[]>;
  validationClasses: (linkId: string) => string;
  ancestorContinuations?: boolean[];
}

// ─── TreeItemsList ────────────────────────────────────────────────────────────

export const TreeItemsList = ({
  nodes,
  qItems,
  qCurrentItem,
  parentPathById,
  validationClasses,
  ancestorContinuations = [],
}: TreeItemsListProps): React.JSX.Element => (
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
