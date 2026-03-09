import { createContext, useContext } from "react";

import type { Items } from "../../../store/treeStore/treeStore";
import type { TreeNode } from "../types";

export interface DraggedNodeContextValue {
  draggedNode: TreeNode | null;
  qItems: Items | undefined;
}

export const DraggedNodeContext = createContext<DraggedNodeContextValue>({
  draggedNode: null,
  qItems: undefined,
});

export const useDraggedNode = (): DraggedNodeContextValue =>
  useContext(DraggedNodeContext);
