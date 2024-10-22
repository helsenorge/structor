import React from "react";

import { QuestionnaireItem } from "fhir/r4";

import { IQuestionnaireItemType } from "../../../types/IQuestionnareItemType";

import ValidationAnswerTypeAttachment from "./ValidationAnswerTypeAttachment";
import ValidationAnswerTypeDate from "./ValidationAnswerTypeDate";
import ValidationAnswerTypeNumber from "./ValidationAnswerTypeNumber";
import ValidationAnswerTypeString from "./ValidationAnswerTypeString";
interface ValidationTypeProp {
  item: QuestionnaireItem;
}

const ValidationAnswerTypes = ({
  item,
}: ValidationTypeProp): React.JSX.Element => {
  const respondType = (itemType: string): JSX.Element | undefined => {
    switch (itemType) {
      case IQuestionnaireItemType.attachment:
        return <ValidationAnswerTypeAttachment item={item} />;
      case IQuestionnaireItemType.date:
      case IQuestionnaireItemType.dateTime:
        return <ValidationAnswerTypeDate item={item} />;
      case IQuestionnaireItemType.string:
      case IQuestionnaireItemType.text:
        return <ValidationAnswerTypeString item={item} />;
      case IQuestionnaireItemType.integer:
      case IQuestionnaireItemType.decimal:
      case IQuestionnaireItemType.quantity:
        return <ValidationAnswerTypeNumber item={item} />;
      default:
        return undefined;
    }
  };

  return <>{respondType(item.type)}</>;
};

export default ValidationAnswerTypes;
