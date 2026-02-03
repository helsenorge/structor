import { useMemo, useEffect, useState } from "react";

import type { OrderItem, Items } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";
import type { Key } from "@react-types/shared";

import { isIgnorableItem } from "../../../helpers/itemControl";

interface TreeDataReturn {
  treeData: TreeNode[];
  parentPathById: Map<string, string[]>;
  expandableKeys: Set<Key>;
}

export const useTreeData = (
  qOrder: OrderItem[],
  qItems: Items,
): TreeDataReturn => {
  return useMemo(() => {
    const parentPathMap = new Map<string, string[]>();
    const expandable = new Set<Key>();

    const mapToTreeData = (
      items: OrderItem[],
      hierarchy: string,
      parentPath: string[],
      parentLinkId?: string,
    ): TreeNode[] => {
      const parentItem = parentLinkId ? qItems[parentLinkId] : undefined;
      return items
        .filter((x) => !isIgnorableItem(qItems[x.linkId], parentItem))
        .map((x, index) => {
          const newHierarchy = `${hierarchy}${index + 1}.`;
          parentPathMap.set(x.linkId, parentPath);
          const children = mapToTreeData(
            x.items,
            newHierarchy,
            [...parentPath, x.linkId],
            x.linkId,
          );
          if (children.length > 0) {
            expandable.add(x.linkId);
          }
          return {
            id: x.linkId,
            hierarchy: newHierarchy,
            children,
          };
        });
    };

    return {
      treeData: mapToTreeData(qOrder, "", []),
      parentPathById: parentPathMap,
      expandableKeys: expandable,
    };
  }, [qItems, qOrder]);
};

export const useExpandedKeys = (
  expandableKeys: Set<Key>,
): [Set<Key>, (keys: Set<Key>) => void] => {
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set());

  useEffect(() => {
    if (expandedKeys.size === 0 && expandableKeys.size > 0) {
      setExpandedKeys(new Set(expandableKeys));
    }
  }, [expandableKeys, expandedKeys.size]);

  return [expandedKeys, setExpandedKeys];
};
