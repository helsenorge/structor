import React, { useContext, useState } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../types/fhir';
import './AdvancedQuestionOptions.css';
import {
    IExtentionType,
    IQuestionnaireItemType
} from '../../types/IQuestionnareItemType';
import InitialOption from './OptionComponents/initial-option';
import {
    isItemControlDataReceiver
} from '../../helpers/itemControl';
import FhirPathSelect from './FhirPathSelect/FhirPathSelect';
import CalculatedExpressionOption from './OptionComponents/calculatedExpression-option';
import CopyFromOption from './OptionComponents/copyFrom-option';
import ViewOption from './OptionComponents/view-option';
import { removeItemExtension, setItemExtension } from '../../helpers/extensionHelper';
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
} from '../../helpers/questionTypeFeatures';
import { ScoringOption } from './OptionComponents/scoring-option';
import { SummationOption } from './OptionComponents/summation-option';
import { SaveCapabilityOption } from './OptionComponents/saveCapability-option';
import { HelpOption } from './OptionComponents/help-option';
import { SummaryOption } from './OptionComponents/summary-option';
import { AfterCompleteFormOption } from './OptionComponents/afterCompleteForm-option';
import { StepViewOption } from './OptionComponents/stepView-option';
import { RepetitionOption } from './OptionComponents/repetition-option';
import { DefinitionOption } from './OptionComponents/definition-option';
import { PrefixOption } from './OptionComponents/prefix-option';
import { LinkIdOption } from './OptionComponents/linkId-option';
import { LinksOption } from './OptionComponents/links-option';
import { PlaceholderOption } from './OptionComponents/placeholder-option';
import { ReadOnlyOption } from './OptionComponents/readOnly-option';

type AdvancedQuestionOptionsProps = {
    item: QuestionnaireItem;
    parentArray: Array<string>;
    conditionalArray: ValueSetComposeIncludeConcept[];
    getItem: (linkId: string) => QuestionnaireItem;
};

const AdvancedQuestionOptions = (props: AdvancedQuestionOptionsProps): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { qItems, qOrder } = state;
    const [isDataReceiver, setDataReceiverState] = useState(isItemControlDataReceiver(props.item));

    const handleExtension = (extension: Extension) => {
        setItemExtension(props.item, extension, dispatch);
    };

    const removeExtension = (extensionUrl: IExtentionType) => {
        removeItemExtension(props.item, extensionUrl, dispatch);
    };

    const isGroupItemOnGlobalLevel = (groupId: string): boolean => {
        return qOrder.find((i) => i.linkId === groupId) ? true : false;
    };

    return (
        <>
            {canTypeBeReadonly(props.item) && (
                <ReadOnlyOption item={props.item} dispatch={dispatch} isDataReceiver={isDataReceiver}/>
            )}
            {canTypeCopyData(props.item) && (
                <CopyFromOption
                    item={props.item}
                    conditionalArray={props.conditionalArray}
                    isDataReceiver={isDataReceiver}
                    canTypeBeReadonly={canTypeBeReadonly(props.item)}
                    dataReceiverStateChanger={setDataReceiverState}
                    getItem={props.getItem}
                />
            )}
            {canTypeHaveCalculatedExpressionExtension(props.item) && (
                <CalculatedExpressionOption
                    item={props.item}
                    disabled={isDataReceiver}
                    updateExtension={handleExtension}
                    removeExtension={removeExtension}
                />
            )}
            {canTypeBeBeriket(props.item) && <FhirPathSelect item={props.item} />}
            {canTypeHavePlaceholderText(props.item) && (
                <PlaceholderOption item={props.item} dispatch={dispatch}/>
            )}
            {canTypeHaveInitialValue(props.item) && (
                <InitialOption item={props.item} />
            )}
            <LinksOption item={props.item}/>
            <LinkIdOption item={props.item} dispatch={dispatch} qItems={qItems} parentArray={props.parentArray}></LinkIdOption>
            {canTypeHavePrefix(props.item) && (
                <PrefixOption item={props.item} dispatch={dispatch}/>
            )}
            <DefinitionOption item={props.item} dispatch={dispatch} />
            {canTypeBeRepeatable(props.item) && (
                <RepetitionOption item={props.item} dispatch={dispatch} />
            )}
            {props.item.type === IQuestionnaireItemType.group && isGroupItemOnGlobalLevel(props.item.linkId) && (
                <StepViewOption item={props.item} dispatch={dispatch} />
            )}
            <AfterCompleteFormOption item={props.item} />
            {canTypeHaveSummary(props.item) && (
                <SummaryOption item={props.item} dispatch={dispatch}></SummaryOption>
            )}
            <HelpOption item={props.item} dispatch={dispatch} parentArray={props.parentArray} qItems={qItems} qOrder={qOrder} />
            <ViewOption item={props.item} />
            <SaveCapabilityOption item={props.item} dispatch={dispatch} />
            {(props.item.type === IQuestionnaireItemType.integer ||
                props.item.type === IQuestionnaireItemType.decimal ||
                props.item.type === IQuestionnaireItemType.quantity) && (
                <SummationOption item = {props.item} dispatch={dispatch}/>
            )}
            {props.item.type === IQuestionnaireItemType.choice && (
                <ScoringOption item={props.item} dispatch={dispatch} />
            )}
        </>
    );
};

export default AdvancedQuestionOptions;
