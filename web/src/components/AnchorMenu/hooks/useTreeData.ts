import { useMemo, useEffect, useRef, useState } from "react";

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
  const prevExpandableRef = useRef<Set<Key>>(new Set());

  useEffect(() => {
    const prev = prevExpandableRef.current;
    const newlyExpandable = [...expandableKeys].filter((k) => !prev.has(k));

    setExpandedKeys((current) => {
      if (current.size === 0 && expandableKeys.size > 0) {
        return new Set(expandableKeys);
      }

      let changed = false;
      const next = new Set(current);

      for (const k of newlyExpandable) {
        if (!next.has(k)) {
          next.add(k);
          changed = true;
        }
      }

      for (const k of current) {
        if (!expandableKeys.has(k)) {
          next.delete(k);
          changed = true;
        }
      }

      return changed ? next : current;
    });

    prevExpandableRef.current = expandableKeys;
  }, [expandableKeys]);

  return [expandedKeys, setExpandedKeys];
};
