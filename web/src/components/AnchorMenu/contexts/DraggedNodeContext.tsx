import { createContext, useContext } from "react";

import type { Items } from "../../../store/treeStore/treeStore";
import type { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";
import type { TreeNode } from "../types";
import type { QuestionnaireItem } from "fhir/r4";

export interface ToolboxDragInfo {
  type:
    | QuestionnaireItem["type"]
    | IQuestionnaireItemType.receiver
    | IQuestionnaireItemType.receiverComponent;
  label: string;
}

export interface DraggedNodeContextValue {
  draggedNode: TreeNode | null;
  toolboxDrag: ToolboxDragInfo | null;
  qItems: Items | undefined;
}

export const DraggedNodeContext = createContext<DraggedNodeContextValue>({
  draggedNode: null,
  toolboxDrag: null,
  qItems: undefined,
});

export const useDraggedNode = (): DraggedNodeContextValue =>
  useContext(DraggedNodeContext);
