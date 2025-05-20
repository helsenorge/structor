import React from "react";

import { format } from "date-fns";
import {
  Coding,
  Quantity,
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
  ValueSet,
} from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IOperator } from "../../../types/IQuestionnareItemType";

import { QuestionnaireItemEnableBehaviorCodes } from "@helsenorge/refero";

import Infobox from "./Infobox";
import createUUID from "../../../helpers/CreateUUID";
import { getValueSetValues } from "../../../helpers/valueSetHelper";

type OperatorMapType = {
  [key: string]: string;
};

const operatorMap: OperatorMapType = {
  [IOperator.exists]: "exists",
  [IOperator.equal]: "is equal to",
  [IOperator.notEqual]: "is not equal",
  [IOperator.greaterThan]: "is greater than",
  [IOperator.lessThan]: "is less than",
  [IOperator.greaterThanOrEqual]: "is greater than or equal",
  [IOperator.lessThanOrEqual]: "is less than or equal",
};

interface Props {
  getItem: (linkId: string) => QuestionnaireItem;
  linkId: string;
  enableWhen: Array<QuestionnaireItemEnableWhen>;
  containedResources?: Array<ValueSet>;
  enableBehavior?: QuestionnaireItemEnableBehaviorCodes;
}

const EnableWhenInfoBox = ({
  getItem,
  linkId,
  enableWhen,
  containedResources,
  enableBehavior,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const getCodingDisplay = (
    conditionLinkId: string,
    coding: Coding,
  ): string => {
    const item = getItem(conditionLinkId);
    let display: string | undefined;
    if (item.answerOption) {
      const codingItem = item.answerOption.find(
        (x) =>
          x.valueCoding?.system === coding.system &&
          x.valueCoding?.code === coding.code,
      );
      display = codingItem?.valueCoding?.display;
    } else if (item.answerValueSet && containedResources) {
      const valueSet = containedResources.find(
        (x) => `#${x.id}` === item.answerValueSet,
      );
      const codingItem = getValueSetValues(valueSet).find(
        (x) => x.code === coding.code && x.system === coding.system,
      );
      display = codingItem?.display;
    }

    return display || t("<not set>");
  };

  const getQuantityDisplay = (answerQuantity: Quantity): string => {
    // TODO: vis riktig unit dersom den kommer fra extension
    let display: string | undefined = "";
    if (answerQuantity) {
      const unit = answerQuantity.unit;
      display = `${answerQuantity.value} ${unit ? unit : answerQuantity.code}`;
    }
    return display;
  };

  const generateCondition = (
    qItemEnableWhen: QuestionnaireItemEnableWhen,
    enableBehaviorText: string,
  ): React.JSX.Element => {
    if (!qItemEnableWhen.question) {
      return <div key={`${linkId}-empty-${createUUID()}`}></div>;
    }
    const conditionItem = getItem(qItemEnableWhen.question);
    if (!conditionItem) {
      // if this happens, this enableWhen refers to a question which does not exist
      // eslint-disable-next-line no-console
      console.warn(
        t("Error in enableWhen: item with linkId {0} does not exist").replace(
          "{0}",
          qItemEnableWhen.question,
        ),
      );
      return (
        <div
          key={`${linkId}-${qItemEnableWhen.question}-${qItemEnableWhen.operator}-notfound`}
        >
          {t(
            "Error in enableWhen: item with linkId {0} does not exist",
          ).replace("{0}", qItemEnableWhen.question)}
        </div>
      );
    }

    let answerCondition: string;
    if (qItemEnableWhen.answerBoolean !== undefined) {
      answerCondition =
        qItemEnableWhen.answerBoolean === true ? t("True") : t("Not true");
    } else if (qItemEnableWhen.answerDecimal !== undefined) {
      answerCondition = qItemEnableWhen.answerDecimal?.toString() ?? "";
    } else if (qItemEnableWhen.answerInteger !== undefined) {
      answerCondition = qItemEnableWhen.answerInteger?.toString() ?? "";
    } else if (qItemEnableWhen.answerDate !== undefined) {
      answerCondition = qItemEnableWhen.answerDate
        ? format(new Date(qItemEnableWhen.answerDate), "dd.MM.yyyy")
        : "";
    } else if (qItemEnableWhen.answerDateTime !== undefined) {
      answerCondition = qItemEnableWhen.answerDateTime
        ? format(new Date(qItemEnableWhen.answerDateTime), "dd.MM.yyyy' 'HH:mm")
        : "";
    } else if (qItemEnableWhen.answerTime !== undefined) {
      answerCondition = qItemEnableWhen.answerTime ?? "";
    } else if (qItemEnableWhen.answerString !== undefined) {
      answerCondition = qItemEnableWhen.answerString ?? "";
    } else if (qItemEnableWhen.answerCoding !== undefined) {
      answerCondition = getCodingDisplay(
        qItemEnableWhen.question,
        qItemEnableWhen.answerCoding,
      );
    } else if (qItemEnableWhen.answerQuantity !== undefined) {
      answerCondition = qItemEnableWhen.answerQuantity
        ? getQuantityDisplay(qItemEnableWhen.answerQuantity)
        : "";
    } else if (qItemEnableWhen.answerReference !== undefined) {
      answerCondition = qItemEnableWhen.answerReference?.reference ?? "";
    } else {
      answerCondition = "";
    }

    return (
      <div
        key={`${linkId}-${qItemEnableWhen.question}-${qItemEnableWhen.operator}-${answerCondition}`}
      >
        {enableBehaviorText && <p>{enableBehaviorText}</p>}
        <strong>{getItem(qItemEnableWhen.question).text}</strong>{" "}
        {t(operatorMap[qItemEnableWhen.operator]) || t("<operator>")}{" "}
        <strong>{answerCondition}</strong>
      </div>
    );
  };
  const enableWhenBehaviorText =
    enableBehavior === QuestionnaireItemEnableBehaviorCodes.ALL
      ? t("and")
      : t("or");

  return (
    <Infobox title={t("Element will be shown if:")}>
      {enableWhen.map((condition, index) => {
        return generateCondition(
          condition,
          index > 0 ? enableWhenBehaviorText : "",
        );
      })}
    </Infobox>
  );
};

export default EnableWhenInfoBox;
