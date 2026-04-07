import {
  type Dispatch,
  type JSX,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";

import { useDragAndDrop } from "react-aria-components";

import type {
  ActionType,
  Items,
  OrderItem,
} from "../../../store/treeStore/treeStore";
import type { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";
import type { ToolboxDragInfo } from "../contexts/DraggedNodeContext";
import type { TreeNode } from "../types";
import type {
  Key,
  DropItem,
  DragItem,
  DropTarget,
  DropOperation,
} from "@react-types/shared";

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
  toolboxDrag: ToolboxDragInfo | null;
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
  toolboxDrag,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}: UseDragAndDropOptions) => {
  const nodeMap = useMemo(() => buildNodeMap(treeData), [treeData]);
  const draggedKeysRef = useRef<Set<Key> | null>(null);
  const [draggedNode, setDraggedNode] = useState<TreeNode | null>(null);
  const getOrderArray = useCallback(
    (orderPath: string[]): OrderItem[] => {
      let current = qOrder;
      for (const id of orderPath) {
        const found = current.find((x) => x.linkId === id);
        if (!found) {
          return [];
        }
        current = found.items;
      }
      return current;
    },
    [qOrder],
  );

  const getUiSiblingIds = useCallback(
    (parentPath: string[]): string[] => {
      const parentId = parentPath[parentPath.length - 1];
      const parentItem = parentId ? qItems[parentId] : undefined;
      return getOrderArray(parentPath)
        .filter((x) => !isIgnorableItem(qItems[x.linkId], parentItem))
        .map((x) => x.linkId);
    },
    [getOrderArray, qItems],
  );

  const handleInternalMove = useCallback(
    (keys: Set<Key>, target: { key: Key; dropPosition: string }): void => {
      const draggedId = getFirstKey(keys);
      if (!draggedId) {
        return;
      }

      const targetId = String(target.key);
      const oldParentPath = parentPathById.get(draggedId) ?? [];
      const targetParentPath = parentPathById.get(targetId) ?? [];

      let newParentPath = targetParentPath;
      let newIndex: number | undefined;

      if (target.dropPosition === "on") {
        newParentPath = [...targetParentPath, targetId];
      } else {
        const targetSiblings = getUiSiblingIds(targetParentPath);
        const targetIndex = targetSiblings.indexOf(targetId);
        if (targetIndex === -1) {
          return;
        }
        newIndex = targetIndex + (target.dropPosition === "after" ? 1 : 0);

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
    [parentPathById, getUiSiblingIds, dispatch],
  );

  const handleExternalDrop = useCallback(
    async (items: DropItem[], target: DropTarget): Promise<void> => {
      const nodeType = await getDroppedToolboxType(items);
      if (!nodeType) {
        return;
      }

      if (target.type === "root") {
        const newItem = getInitialItemConfig(nodeType, recipientComponentLabel);
        dispatch(newItemAction(newItem, []));
        return;
      }

      if (target.type !== "item") {
        return;
      }

      const targetId = String(target.key);
      const targetParentPath = parentPathById.get(targetId) ?? [];

      if (target.dropPosition === "on") {
        const newParentPath = [...targetParentPath, targetId];
        const newItem = getInitialItemConfig(nodeType, recipientComponentLabel);
        dispatch(newItemAction(newItem, newParentPath));
      } else {
        const targetSiblings = getUiSiblingIds(targetParentPath);
        const targetIndex = targetSiblings.indexOf(targetId);
        if (targetIndex === -1) {
          return;
        }
        const insertIndex =
          targetIndex + (target.dropPosition === "after" ? 1 : 0);
        const newItem = getInitialItemConfig(nodeType, recipientComponentLabel);
        dispatch(newItemAction(newItem, targetParentPath, insertIndex));
      }
    },
    [parentPathById, getUiSiblingIds, dispatch, recipientComponentLabel],
  );

  const dndResult = useDragAndDrop({
    acceptedDragTypes: "all",
    getItems: (keys: Set<Key>): DragItem[] => {
      return Array.from(keys).map((k) => ({
        [TREE_ITEM_DRAG_TYPE]: String(k),
      }));
    },
    onDragStart: (e): void => {
      draggedKeysRef.current = e.keys;
      const draggedId = getFirstKey(e.keys);
      setDraggedNode(draggedId ? (nodeMap.get(draggedId) ?? null) : null);
    },
    onDragEnd: (): void => {
      draggedKeysRef.current = null;
      setDraggedNode(null);
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
    onDrop: (e: {
      target: DropTarget;
      items: DropItem[];
      dropOperation: DropOperation;
    }): void => {
      const isInternal =
        draggedKeysRef.current != null && draggedKeysRef.current.size > 0;

      if (isInternal && e.target.type === "item") {
        handleInternalMove(draggedKeysRef.current!, e.target);
      } else if (!isInternal) {
        void handleExternalDrop(e.items, e.target);
      }
    },
    // Keep onMove/onInsert/onItemDrop/onRootDrop so that
    // useDragAndDrop treats the tree as droppable (isDroppable check)
    // and so shouldAcceptItemDrop / getDropOperation work correctly.
    // The actual dispatch is handled by onDrop above.
    onMove: (): void => {
      /* handled by onDrop */
    },
    onInsert: (): void => {
      /* handled by onDrop */
    },
    onItemDrop: (): void => {
      /* handled by onDrop */
    },
    onRootDrop: (): void => {
      /* handled by onDrop */
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
          toolboxDrag={toolboxDrag}
          qItems={qItems}
        />
      );
    },
  });

  return { ...dndResult, draggedNode };
};
