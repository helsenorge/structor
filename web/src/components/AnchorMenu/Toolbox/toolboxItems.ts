import type { QuestionnaireItem } from "fhir/r4";

export const TOOLBOX_ITEM_DEFINITIONS: {
  id: QuestionnaireItem["type"] | "receiver" | "receiverComponent";
  type: QuestionnaireItem["type"] | "receiver" | "receiverComponent";
  labelKey: string;
  isRecipientComponent?: boolean;
}[] = [
  {
    id: "group",
    type: "group",
    labelKey: "Group",
  },
  {
    id: "string",
    type: "string",
    labelKey: "Text answer",
  },
  {
    id: "display",
    type: "display",
    labelKey: "Information text",
  },
  {
    id: "attachment",
    type: "attachment",
    labelKey: "Attachment",
  },
  {
    id: "receiver",
    type: "receiver",
    labelKey: "Recipient list",
  },
  {
    id: "receiverComponent",
    type: "receiverComponent",
    labelKey: "Recipient component",
    isRecipientComponent: true,
  },
  {
    id: "boolean",
    type: "boolean",
    labelKey: "Confirmation",
  },
  {
    id: "choice",
    type: "choice",
    labelKey: "Choice",
  },
  {
    id: "date",
    type: "date",
    labelKey: "Date",
  },
  {
    id: "time",
    type: "time",
    labelKey: "Time",
  },
  {
    id: "integer",
    type: "integer",
    labelKey: "Number",
  },
  {
    id: "quantity",
    type: "quantity",
    labelKey: "Quantity",
  },
];
