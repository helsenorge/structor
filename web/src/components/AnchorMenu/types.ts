import type { IQuestionnaireItemType } from "../../types/IQuestionnareItemType";
import type { QuestionnaireItem } from "fhir/r4";

export type TreeNode = {
  id: string;
  hierarchy: string;
  children: TreeNode[];
};

export type ToolboxNode = {
  id: string;
  type:
    | QuestionnaireItem["type"]
    | IQuestionnaireItemType.receiver
    | IQuestionnaireItemType.receiverComponent;
  label: string;
};

export type DragItem = Record<string, string>;
