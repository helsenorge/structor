import { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";

export const TOOLBOX_ITEM_DEFINITIONS = [
  {
    id: `${IQuestionnaireItemType.group}`,
    type: IQuestionnaireItemType.group,
    labelKey: "Group",
  },
  {
    id: `${IQuestionnaireItemType.string}`,
    type: IQuestionnaireItemType.string,
    labelKey: "Text answer",
  },
  {
    id: `${IQuestionnaireItemType.display}`,
    type: IQuestionnaireItemType.display,
    labelKey: "Information text",
  },
  {
    id: `${IQuestionnaireItemType.attachment}`,
    type: IQuestionnaireItemType.attachment,
    labelKey: "Attachment",
  },
  {
    id: `${IQuestionnaireItemType.receiver}`,
    type: IQuestionnaireItemType.receiver,
    labelKey: "Recipient list",
  },
  {
    id: `${IQuestionnaireItemType.receiverComponent}`,
    type: IQuestionnaireItemType.receiverComponent,
    labelKey: "Recipient component",
    isRecipientComponent: true,
  },
  {
    id: `${IQuestionnaireItemType.boolean}`,
    type: IQuestionnaireItemType.boolean,
    labelKey: "Confirmation",
  },
  {
    id: `${IQuestionnaireItemType.choice}`,
    type: IQuestionnaireItemType.choice,
    labelKey: "Choice",
  },
  {
    id: `${IQuestionnaireItemType.date}`,
    type: IQuestionnaireItemType.date,
    labelKey: "Date",
  },
  {
    id: `${IQuestionnaireItemType.time}`,
    type: IQuestionnaireItemType.time,
    labelKey: "Time",
  },
  {
    id: `${IQuestionnaireItemType.integer}`,
    type: IQuestionnaireItemType.integer,
    labelKey: "Number",
  },
  {
    id: `${IQuestionnaireItemType.quantity}`,
    type: IQuestionnaireItemType.quantity,
    labelKey: "Quantity",
  },
];
