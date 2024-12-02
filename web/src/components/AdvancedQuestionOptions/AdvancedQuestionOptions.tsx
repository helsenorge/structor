import React, { useContext, useState } from "react";

import {
  Extension,
  QuestionnaireItem,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";

import "./AdvancedQuestionOptions.css";
import {
  IExtensionType,
  IQuestionnaireItemType,
} from "../../types/IQuestionnareItemType";

import FhirPathSelect from "./FhirPathSelect/FhirPathSelect";
import { AfterCompleteFormOption } from "./optionComponents/afterCompleteForm-option";
import CalculatedExpressionOption from "./optionComponents/calculatedExpression-option";
import CopyFromOption from "./optionComponents/copyFrom-option";
import { DefinitionOption } from "./optionComponents/definition-option";
import { HelpOption } from "./optionComponents/help-option";
import InitialOption from "./optionComponents/initial-option";
import { LinkIdOption } from "./optionComponents/linkId-option";
import { LinksOption } from "./optionComponents/links-option";
import { PlaceholderOption } from "./optionComponents/placeholder-option";
import { PrefixOption } from "./optionComponents/prefix-option";
import { ReadOnlyOption } from "./optionComponents/readOnly-option";
import { RepetitionOption } from "./optionComponents/repetition-option";
import { SaveCapabilityOption } from "./optionComponents/saveCapability-option";
import { ScoringOption } from "./optionComponents/scoring-option";
import { StepViewOption } from "./optionComponents/stepView-option";
import { SummaryOption } from "./optionComponents/summary-option";
import { SummationOption } from "./optionComponents/summation-option";
import { ColumnOption } from "./optionComponents/tableOptions/column-option";
import { TableOption } from "./optionComponents/tableOptions/table-option";
import { ValidateReadOnlyOption } from "./optionComponents/validate-readOnly-option";
import ViewOption from "./optionComponents/view-option";
import {
  removeItemExtension,
  setItemExtension,
} from "../../helpers/extensionHelper";
import {
  ItemControlType,
  existItemControlWithCode,
  isItemControlDataReceiver,
} from "../../helpers/itemControl";
import {
  canTypeBeBeriket,
  canTypeBeReadonly,
  canTypeBeRepeatable,
  canTypeHaveCalculatedExpressionExtension,
  canTypeHaveInitialValue,
  canTypeHavePlaceholderText,
  canTypeHavePrefix,
  canTypeHaveSummary,
  canTypeCopyData,
} from "../../helpers/questionTypeFeatures";
import { TreeContext } from "../../store/treeStore/treeStore";
import ItemExtractionContextView from "./ItemExtractionContext/ItemExtractionView";

type AdvancedQuestionOptionsProps = {
  item: QuestionnaireItem;
  parentArray: Array<string>;
  conditionalArray: ValueSetComposeIncludeConcept[];
  getItem: (linkId: string) => QuestionnaireItem;
};

const AdvancedQuestionOptions = ({
  item,
  parentArray,
  conditionalArray,
  getItem,
}: AdvancedQuestionOptionsProps): React.JSX.Element => {
  const { state, dispatch } = useContext(TreeContext);
  const { qItems, qOrder } = state;
  const [isDataReceiver, setDataReceiverState] = useState(
    isItemControlDataReceiver(item)
  );

  const parentItem = getItem(parentArray[parentArray.length - 1]) || [];
  const showTableColumnOption = (): boolean => {
    let returnValue: boolean = false;
    if (
      parentItem &&
      (existItemControlWithCode(parentItem, ItemControlType.tableHN2) ||
        existItemControlWithCode(parentItem, ItemControlType.gTable))
    ) {
      returnValue = true;
    }
    return returnValue;
  };

  const handleExtension = (extension: Extension): void => {
    setItemExtension(item, extension, dispatch);
  };

  const removeExtension = (extensionUrl: IExtensionType): void => {
    removeItemExtension(item, extensionUrl, dispatch);
  };

  const isGroupItemOnGlobalLevel = (groupId: string): boolean => {
    return qOrder.find((i) => i.linkId === groupId) ? true : false;
  };

  return (
    <>
      {canTypeBeReadonly(item) && (
        <ReadOnlyOption
          item={item}
          dispatch={dispatch}
          isDataReceiver={isDataReceiver}
        />
      )}
      {canTypeCopyData(item) && (
        <CopyFromOption
          item={item}
          conditionalArray={conditionalArray}
          isDataReceiver={isDataReceiver}
          canTypeBeReadonly={canTypeBeReadonly(item)}
          dataReceiverStateChanger={setDataReceiverState}
          getItem={getItem}
        />
      )}
      {canTypeHaveCalculatedExpressionExtension(item) && (
        <CalculatedExpressionOption
          item={item}
          disabled={isDataReceiver}
          updateExtension={handleExtension}
          removeExtension={removeExtension}
        />
      )}
      {canTypeBeBeriket(item) && <FhirPathSelect item={item} />}
      {canTypeHavePlaceholderText(item) && (
        <PlaceholderOption item={item} dispatch={dispatch} />
      )}
      {canTypeHaveInitialValue(item) && <InitialOption item={item} />}
      <LinksOption item={item} />
      <LinkIdOption
        item={item}
        dispatch={dispatch}
        qItems={qItems}
        parentArray={parentArray}
      ></LinkIdOption>
      {canTypeHavePrefix(item) && (
        <PrefixOption item={item} dispatch={dispatch} />
      )}
      <DefinitionOption item={item} dispatch={dispatch} />
      <ItemExtractionContextView item={item} />
      {canTypeBeRepeatable(item) && (
        <RepetitionOption item={item} dispatch={dispatch} />
      )}
      {item.type === IQuestionnaireItemType.group &&
        isGroupItemOnGlobalLevel(item.linkId) && (
          <StepViewOption item={item} dispatch={dispatch} />
        )}
      <AfterCompleteFormOption item={item} />
      {canTypeHaveSummary(item) && (
        <SummaryOption item={item} dispatch={dispatch}></SummaryOption>
      )}
      {item.type === IQuestionnaireItemType.group && (
        <TableOption
          item={item}
          qItems={qItems}
          qOrder={qOrder}
          qContained={state.qContained}
          dispatch={dispatch}
        />
      )}
      {showTableColumnOption() && (
        <ColumnOption item={item} parentItem={parentItem} dispatch={dispatch} />
      )}
      <HelpOption
        item={item}
        dispatch={dispatch}
        parentArray={parentArray}
        qItems={qItems}
        qOrder={qOrder}
      />
      <ViewOption item={item} />
      <SaveCapabilityOption item={item} dispatch={dispatch} />
      {(item.type === IQuestionnaireItemType.integer ||
        item.type === IQuestionnaireItemType.decimal ||
        item.type === IQuestionnaireItemType.quantity) && (
        <SummationOption item={item} dispatch={dispatch} />
      )}
      {item.type === IQuestionnaireItemType.choice && (
        <ScoringOption item={item} dispatch={dispatch} />
      )}
    </>
  );
};

export default AdvancedQuestionOptions;
