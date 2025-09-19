import "./EnableWhen.css";

import React, { useContext } from "react";

import {
  QuestionnaireItem,
  QuestionnaireItemEnableWhen,
  ValueSet,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  IItemProperty,
  IOperator,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import { QuestionnaireItemEnableBehaviorCodes } from "@helsenorge/refero";

import EnableBehavior from "./EnableBehavior";
import EnableWhenAnswerTypes from "./EnableWhenAnswerTypes";
import EnableWhenInfoBox from "./EnableWhenInfoBox";
import EnableWhenOperator from "./EnableWhenOperator";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import { ValidationError } from "../../../utils/validationUtils";
import Btn from "../../Btn/Btn";
import FormField from "../../FormField/FormField";
import Select from "../../Select/Select";

type Props = {
  getItem: (linkId: string) => QuestionnaireItem;
  conditionalArray: ValueSetComposeIncludeConcept[];
  linkId: string;
  enableWhen: QuestionnaireItemEnableWhen[];
  containedResources?: Array<ValueSet>;
  itemValidationErrors: ValidationError[];
};

const EnableWhen = ({
  getItem,
  conditionalArray,
  linkId,
  enableWhen,
  containedResources,
  itemValidationErrors,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const dispatchUpdateItemEnableWhen = (
    value: QuestionnaireItemEnableWhen[] | undefined,
  ): void => {
    dispatch(updateItemAction(linkId, IItemProperty.enableWhen, value));
  };
  const dispatchUpdateItemEnableBehavior = (
    value: QuestionnaireItemEnableBehaviorCodes | undefined,
  ): void => {
    dispatch(updateItemAction(linkId, IItemProperty.enableBehavior, value));
  };

  const isSupportedType = (conditionItemType: string): boolean => {
    return !(
      conditionItemType === IQuestionnaireItemType.group ||
      conditionItemType === IQuestionnaireItemType.display ||
      conditionItemType === IQuestionnaireItemType.attachment ||
      conditionItemType === IQuestionnaireItemType.reference
    );
  };

  const conditionCanBeEdited = (question: string): boolean => {
    return conditionalArray.filter((x) => x.code === question).length > 0;
  };

  return (
    <div>
      <p>{t("Set condition for display of element")}</p>
      {enableWhen.map((x, index) => {
        const conditionItem = getItem(x.question);
        const hasValidationError = itemValidationErrors.some(
          (error) =>
            error.errorProperty.substring(0, 10) === "enableWhen" &&
            index === error.index,
        );
        return (
          <div
            key={`${linkId}-${x.question}-${x.operator}-${index}`}
            className={`enablewhen-box ${
              hasValidationError ? "error-highlight" : ""
            }`}
          >
            {!x.question || conditionCanBeEdited(x.question) ? (
              <>
                <FormField label={t("Select earlier question:")}>
                  <Select
                    placeholder={t("Choose question:")}
                    options={conditionalArray}
                    value={x.question}
                    onChange={(event) => {
                      const copy = getItem(linkId).enableWhen?.map(
                        (ew, ewIndex) => {
                          // clear any answer[x] values when changing question condition
                          return index === ewIndex
                            ? ({
                                question: event.target.value,
                                operator: IOperator.equal,
                              } as QuestionnaireItemEnableWhen)
                            : ew;
                        },
                      );
                      dispatchUpdateItemEnableWhen(copy);
                    }}
                  />
                </FormField>
                {!!conditionItem && isSupportedType(conditionItem.type) && (
                  <FormField label={t("Show if answer is:")}>
                    <div className="enablewhen-condition">
                      <EnableWhenOperator
                        conditionItem={conditionItem}
                        thisItem={getItem(linkId)}
                        ew={x}
                        ewIndex={index}
                        dispatchUpdateItemEnableWhen={
                          dispatchUpdateItemEnableWhen
                        }
                      />
                      <div className="enableWhen-condition__answer">
                        {x.operator !== IOperator.exists && (
                          <EnableWhenAnswerTypes
                            conditionItem={conditionItem}
                            index={index}
                            enableWhen={x}
                            itemEnableWhen={getItem(linkId).enableWhen}
                            containedResources={containedResources}
                            dispatchUpdateItemEnableWhen={
                              dispatchUpdateItemEnableWhen
                            }
                          />
                        )}
                      </div>
                    </div>
                  </FormField>
                )}
                {!!conditionItem && !isSupportedType(conditionItem.type) && (
                  <p>
                    {`${t(
                      "The form builder does not support enableWhen of type:",
                    )} `}
                    <strong>{conditionItem.type}</strong>
                  </p>
                )}
              </>
            ) : (
              <>
                <div>
                  {t("This condition cannot be edited in the form builder:")}
                </div>
                <div>{JSON.stringify(x, undefined, 2)}</div>
              </>
            )}
            <Btn
              onClick={() => {
                const ews = getItem(linkId).enableWhen;
                const copy = ews?.filter(
                  (_ew, filterIndex) => filterIndex !== index,
                );
                dispatchUpdateItemEnableWhen(copy);
              }}
              variant="secondary"
              icon="ion-ios-trash"
              title={t("Remove condition")}
            />
          </div>
        );
      })}
      <Btn
        onClick={() => {
          const ews = getItem(linkId).enableWhen;
          const copy: QuestionnaireItemEnableWhen[] = ews ? ews : [];
          dispatchUpdateItemEnableWhen(
            copy.concat({} as QuestionnaireItemEnableWhen),
          );
        }}
        variant="primary"
        icon="ion-plus-round"
        title={t("Add a condition")}
      />
      {enableWhen.length > 1 && (
        <EnableBehavior
          currentItem={getItem(linkId)}
          dispatchUpdateItemEnableBehavior={dispatchUpdateItemEnableBehavior}
        />
      )}
      {enableWhen.length > 0 && (
        <EnableWhenInfoBox
          getItem={getItem}
          linkId={linkId}
          enableWhen={enableWhen}
          containedResources={containedResources}
          enableBehavior={
            getItem(linkId)
              .enableBehavior as QuestionnaireItemEnableBehaviorCodes
          }
        />
      )}
    </div>
  );
};

export default EnableWhen;
