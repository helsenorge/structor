import type { IQuestionnaireItemType } from "../../types/IQuestionnareItemType";

export type TreeNode = {
  id: string;
  hierarchy: string;
  children: TreeNode[];
};

export type ToolboxNode = {
  id: string;
  type: IQuestionnaireItemType;
  label: string;
};

export type DragItem = Record<string, string>;
