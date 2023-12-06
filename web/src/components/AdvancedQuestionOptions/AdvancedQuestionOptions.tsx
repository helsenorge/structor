import React, { useContext, useState } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../types/fhir';
import './AdvancedQuestionOptions.css';
import {
    IExtentionType,
    IQuestionnaireItemType
} from '../../types/IQuestionnareItemType';
import Initial from './Initial/Initial';
import { isItemControlDataReceiver } from '../../helpers/itemControl';
import FhirPathSelect from './FhirPathSelect/FhirPathSelect';
import CalculatedExpression from './CalculatedExpression/CalculatedExpression';
import CopyFrom from './CopyFrom/CopyFrom';
import View from './View/view';
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
import { ScoringOption } from './AdvancedQuestionOption/scoring-option';
import { SummationOption } from './AdvancedQuestionOption/summation-option';
import { SaveCapabilityOption } from './AdvancedQuestionOption/saveCapability-option';
import { HelpOption } from './AdvancedQuestionOption/help-option';
import { SummaryOption } from './AdvancedQuestionOption/summary-option';
import { AfterCompleteFormOption } from './AdvancedQuestionOption/afterCompleteForm-option';
import { StepViewOption } from './AdvancedQuestionOption/stepView-option';
import { RepetitionOption } from './AdvancedQuestionOption/repetition-option';
import { DefinitionOption } from './AdvancedQuestionOption/definition-option';
import { PrefixOption } from './AdvancedQuestionOption/prefix-option';
import { LinkIdOption } from './AdvancedQuestionOption/linkId-option';
import { LinksOption } from './AdvancedQuestionOption/links-option';
import { PlaceholderOption } from './AdvancedQuestionOption/placeholder-option';
import { ReadOnlyOption } from './AdvancedQuestionOption/readOnly-option';

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
                <CopyFrom
                    item={props.item}
                    conditionalArray={props.conditionalArray}
                    isDataReceiver={isDataReceiver}
                    canTypeBeReadonly={canTypeBeReadonly(props.item)}
                    dataReceiverStateChanger={setDataReceiverState}
                    getItem={props.getItem}
                />
            )}
            {canTypeHaveCalculatedExpressionExtension(props.item) && (
                <CalculatedExpression
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
                <Initial item={props.item} />
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
            <View item={props.item} />
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
