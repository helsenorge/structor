import { type Dispatch, type JSX, useRef, useMemo } from "react";

import { useDragAndDrop } from "react-aria-components";

import type {
  ActionType,
  Items,
  OrderItem,
} from "../../../store/treeStore/treeStore";
import type { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";
import type { TreeNode } from "../types";
import type { Key, DropItem, DragItem } from "@react-types/shared";

import { isIgnorableItem } from "../../../helpers/itemControl";
import {
  canTypeHaveChildren,
  getInitialItemConfig,
} from "../../../helpers/questionTypeFeatures";
import {
  moveItemAction,
  newItemAction,
  reorderItemAction,
} from "../../../store/treeStore/treeActions";
import { DropIndicatorRenderer } from "../DropIndicatorRenderer/DropIndicatorRenderer";

const TOOLBOX_DRAG_TYPE = "application/x-hn-questionnaire-item";
const TREE_ITEM_DRAG_TYPE = "application/x-hn-tree-item";

const getFirstKey = (keys: Set<Key>): string | null => {
  const first = keys.values().next().value;
  if (first === undefined || first === null) {
    return null;
  }
  return String(first);
};

const getDroppedToolboxType = async (
  items: DropItem[],
): Promise<IQuestionnaireItemType | null> => {
  for (const item of items) {
    if (item.kind !== "text") {
      continue;
    }
    if (!item.types.has(TOOLBOX_DRAG_TYPE)) {
      continue;
    }
    try {
      const data = await item.getText(TOOLBOX_DRAG_TYPE);
      const parsed = JSON.parse(data) as { nodeType?: IQuestionnaireItemType };
      return parsed.nodeType ?? null;
    } catch {
      return null;
    }
  }
  return null;
};

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

interface UseDragAndDropOptions {
  qOrder: OrderItem[];
  qItems: Items;
  treeData: TreeNode[];
  parentPathById: Map<string, string[]>;
  dispatch: Dispatch<ActionType>;
  recipientComponentLabel: string;
}

const buildNodeMap = (nodes: TreeNode[]): Map<string, TreeNode> => {
  const map = new Map<string, TreeNode>();
  const walk = (list: TreeNode[]): void => {
    for (const node of list) {
      map.set(node.id, node);
      walk(node.children);
    }
  };
  walk(nodes);
  return map;
};

export const useTreeDragAndDrop = ({
  qOrder,
  qItems,
  treeData,
  parentPathById,
  dispatch,
  recipientComponentLabel,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}: UseDragAndDropOptions) => {
  const nodeMap = useMemo(() => buildNodeMap(treeData), [treeData]);
  const draggedKeysRef = useRef<Set<Key> | null>(null);
  const getOrderArray = (orderPath: string[]): OrderItem[] => {
    let current = qOrder;
    for (const id of orderPath) {
      const found = current.find((x) => x.linkId === id);
      if (!found) {
        return [];
      }
      current = found.items;
    }
    return current;
  };

  const getUiSiblingIds = (parentPath: string[]): string[] => {
    const parentId = parentPath[parentPath.length - 1];
    const parentItem = parentId ? qItems[parentId] : undefined;
    return getOrderArray(parentPath)
      .filter((x) => !isIgnorableItem(qItems[x.linkId], parentItem))
      .map((x) => x.linkId);
  };

  return useDragAndDrop({
    acceptedDragTypes: "all",
    getItems: (keys: Set<Key>): DragItem[] => {
      return Array.from(keys).map((k) => ({
        [TREE_ITEM_DRAG_TYPE]: String(k),
      }));
    },
    onDragStart: (e): void => {
      draggedKeysRef.current = e.keys;
    },
    onDragEnd: (): void => {
      draggedKeysRef.current = null;
    },
    getDropOperation: (_target, types, allowedOperations) => {
      if (types.has(TOOLBOX_DRAG_TYPE)) {
        return allowedOperations.includes("copy") ? "copy" : "move";
      }
      return "move";
    },
    shouldAcceptItemDrop: (target) => {
      if (target.dropPosition !== "on") {
        return true;
      }
      const item = qItems[String(target.key)];
      return item ? canTypeHaveChildren(item) : false;
    },
    onMove: (e): void => {
      const draggedId = getFirstKey(e.keys);
      if (!draggedId) {
        return;
      }

      const targetId = String(e.target.key);
      const oldParentPath = parentPathById.get(draggedId) ?? [];
      const targetParentPath = parentPathById.get(targetId) ?? [];

      let newParentPath = targetParentPath;
      let newIndex: number | undefined;

      if (e.target.dropPosition === "on") {
        newParentPath = [...targetParentPath, targetId];
      } else {
        const targetSiblings = getUiSiblingIds(targetParentPath);
        const targetIndex = targetSiblings.indexOf(targetId);
        if (targetIndex === -1) {
          return;
        }
        newIndex = targetIndex + (e.target.dropPosition === "after" ? 1 : 0);

        if (arraysEqual(oldParentPath, targetParentPath)) {
          const oldSiblings = targetSiblings;
          const oldIndex = oldSiblings.indexOf(draggedId);
          if (oldIndex !== -1 && oldIndex < newIndex) {
            newIndex -= 1;
          }
        }
      }

      if (arraysEqual(oldParentPath, newParentPath)) {
        if (newIndex === undefined) {
          return;
        }
        dispatch(reorderItemAction(draggedId, newParentPath, newIndex));
      } else {
        dispatch(
          moveItemAction(draggedId, newParentPath, oldParentPath, newIndex),
        );
      }
    },
    onInsert: (e): void => {
      const insertAsync = async (): Promise<void> => {
        const nodeType = await getDroppedToolboxType(e.items);
        if (!nodeType) {
          return;
        }

        const targetId = String(e.target.key);
        const targetParentPath = parentPathById.get(targetId) ?? [];

        const targetSiblings = getUiSiblingIds(targetParentPath);
        const targetIndex = targetSiblings.indexOf(targetId);
        if (targetIndex === -1) {
          return;
        }

        const insertIndex =
          targetIndex + (e.target.dropPosition === "after" ? 1 : 0);
        const newItem = getInitialItemConfig(nodeType, recipientComponentLabel);
        dispatch(newItemAction(newItem, targetParentPath, insertIndex));
      };

      void insertAsync();
    },
    onItemDrop: (e): void => {
      const itemDropAsync = async (): Promise<void> => {
        if (e.isInternal) {
          return;
        }
        const nodeType = await getDroppedToolboxType(e.items);
        if (!nodeType) {
          return;
        }
        const targetId = String(e.target.key);
        const targetParentPath = parentPathById.get(targetId) ?? [];
        const newParentPath = [...targetParentPath, targetId];
        const newItem = getInitialItemConfig(nodeType, recipientComponentLabel);
        dispatch(newItemAction(newItem, newParentPath));
      };

      void itemDropAsync();
    },
    onRootDrop: (e): void => {
      const rootDropAsync = async (): Promise<void> => {
        const nodeType = await getDroppedToolboxType(e.items);
        if (!nodeType) {
          return;
        }
        const newItem = getInitialItemConfig(nodeType, recipientComponentLabel);
        dispatch(newItemAction(newItem, []));
      };

      void rootDropAsync();
    },
    renderDropIndicator: (target): JSX.Element => {
      const draggedId = draggedKeysRef.current
        ? getFirstKey(draggedKeysRef.current)
        : null;
      const draggedNode = draggedId ? (nodeMap.get(draggedId) ?? null) : null;

      return (
        <DropIndicatorRenderer
          target={target}
          parentPathById={parentPathById}
          draggedNode={draggedNode}
          qItems={qItems}
        />
      );
    },
  });
};
