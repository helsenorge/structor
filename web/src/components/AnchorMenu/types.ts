import type { QuestionnaireItem } from "fhir/r4";

export type TreeNode = {
  id: string;
  hierarchy: string;
  children: TreeNode[];
};

export type ToolboxNode = {
  id: string;
  type: QuestionnaireItem["type"] | "receiver" | "receiverComponent";
  label: string;
};

export type DragItem = Record<string, string>;
