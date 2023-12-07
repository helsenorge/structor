import React, { useContext, useState } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../types/fhir';
import './AdvancedQuestionOptions.css';
import {
    IExtentionType,
    IQuestionnaireItemType
} from '../../types/IQuestionnareItemType';
import InitialOption from './optionComponents/initial-option';
import {
    isItemControlDataReceiver
} from '../../helpers/itemControl';
import FhirPathSelect from './FhirPathSelect/FhirPathSelect';
import CalculatedExpressionOption from './optionComponents/calculatedExpression-option';
import CopyFromOption from './optionComponents/copyFrom-option';
import ViewOption from './optionComponents/view-option';
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
import { ScoringOption } from './optionComponents/scoring-option';
import { SummationOption } from './optionComponents/summation-option';
import { SaveCapabilityOption } from './optionComponents/saveCapability-option';
import { HelpOption } from './optionComponents/help-option';
import { SummaryOption } from './optionComponents/summary-option';
import { AfterCompleteFormOption } from './optionComponents/afterCompleteForm-option';
import { StepViewOption } from './optionComponents/stepView-option';
import { RepetitionOption } from './optionComponents/repetition-option';
import { DefinitionOption } from './optionComponents/definition-option';
import { PrefixOption } from './optionComponents/prefix-option';
import { LinkIdOption } from './optionComponents/linkId-option';
import { LinksOption } from './optionComponents/links-option';
import { PlaceholderOption } from './optionComponents/placeholder-option';
import { ReadOnlyOption } from './optionComponents/readOnly-option';

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
