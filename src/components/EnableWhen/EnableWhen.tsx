import './EnableWhen.css';

import { IItemProperty, IOperator, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import {
    QuestionnaireItem,
    QuestionnaireItemEnableBehaviorCodes,
    QuestionnaireItemEnableWhen,
    ValueSet,
    ValueSetComposeIncludeConcept,
} from '../../types/fhir';
import React, { useContext } from 'react';

import EnableBehavior from './EnableBehavior';
import EnableWhenAnswerTypes from './EnableWhenAnswerTypes';
import EnableWhenInfoBox from './EnableWhenInfoBox';
import FormField from '../FormField/FormField';
import Select from '../Select/Select';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateItemAction } from '../../store/treeStore/treeActions';
import EnableWhenOperator from './EnableWhenOperator';
import { ValidationErrors } from '../../helpers/orphanValidation';

type Props = {
    getItem: (linkId: string) => QuestionnaireItem;
    conditionalArray: ValueSetComposeIncludeConcept[];
    linkId: string;
    enableWhen: QuestionnaireItemEnableWhen[];
    containedResources?: Array<ValueSet>;
    itemValidationErrors: ValidationErrors[];
};

const EnableWhen = ({
    getItem,
    conditionalArray,
    linkId,
    enableWhen,
    containedResources,
    itemValidationErrors,
}: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const dispatchUpdateItemEnableWhen = (value: QuestionnaireItemEnableWhen[] | undefined) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableWhen, value));
    };
    const dispatchUpdateItemEnableBehavior = (value: QuestionnaireItemEnableBehaviorCodes | undefined) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableBehavior, value));
    };

    // TODO: support most of these item types
    const isSupportedType = (conditionItemType: string): boolean => {
        return !(
            conditionItemType === IQuestionnaireItemType.group ||
            conditionItemType === IQuestionnaireItemType.display ||
            conditionItemType === IQuestionnaireItemType.attachment ||
            conditionItemType === IQuestionnaireItemType.reference
        );
    };

    const conditionCanBeEdited = (question: string) => {
        return conditionalArray.filter((x) => x.code === question).length > 0;
    };

    return (
        <>
            <p>Sett betingelser for visning av elementet.</p>
            {enableWhen.map((x, index) => {
                const conditionItem = getItem(x.question);
                const hasValidationError = itemValidationErrors.some(
                    (x) => x.errorProperty === 'enableWhen' && index === x.index,
                );
                return (
                    // we cannot use index as key, since we can also delete elements. Try to find a better index...
                    <div
                        key={`${linkId}-${x.question}-${x.operator}-${index}`}
                        className={`enablewhen-box ${hasValidationError ? 'validation-error' : ''}`}
                    >
                        {!x.question || conditionCanBeEdited(x.question) ? (
                            <>
                                <FormField label="Velg tidligere spørsmål:">
                                    <Select
                                        placeholder="Velg spørsmål"
                                        options={conditionalArray}
                                        value={x.question}
                                        onChange={(event) => {
                                            const copy = getItem(linkId).enableWhen?.map((x, ewIndex) => {
                                                // clear any answer[x] values when changing question condition
                                                return index === ewIndex
                                                    ? ({
                                                          question: event.target.value,
                                                          operator: IOperator.equal,
                                                      } as QuestionnaireItemEnableWhen)
                                                    : x;
                                            });
                                            dispatchUpdateItemEnableWhen(copy);
                                        }}
                                    />
                                </FormField>
                                {!!conditionItem && isSupportedType(conditionItem.type) && (
                                    <FormField label="Vis hvis svaret:">
                                        <div className="enablewhen-condition">
                                            <EnableWhenOperator
                                                conditionItem={conditionItem}
                                                thisItem={getItem(linkId)}
                                                ew={x}
                                                ewIndex={index}
                                                dispatchUpdateItemEnableWhen={dispatchUpdateItemEnableWhen}
                                            />
                                            <div className="enableWhen-condition__answer">
                                                {x.operator !== IOperator.exists && (
                                                    <EnableWhenAnswerTypes
                                                        conditionItem={conditionItem}
                                                        index={index}
                                                        enableWhen={x}
                                                        itemEnableWhen={getItem(linkId).enableWhen}
                                                        containedResources={containedResources}
                                                        dispatchUpdateItemEnableWhen={dispatchUpdateItemEnableWhen}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </FormField>
                                )}
                                {!!conditionItem && !isSupportedType(conditionItem.type) && (
                                    <p>
                                        Skjemabyggeren støtter ikke betinget visning av typen:{' '}
                                        <strong>{conditionItem.type}</strong>
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <div>Denne betingelsen kan ikke editeres i skjemabyggeren:</div>
                                <div>{JSON.stringify(x, undefined, 2)}</div>
                            </>
                        )}
                        <button
                            className="question-button"
                            onClick={() => {
                                const ews = getItem(linkId).enableWhen;
                                const copy = ews?.filter((x, filterIndex) => filterIndex !== index);
                                dispatchUpdateItemEnableWhen(copy);
                            }}
                        >
                            <i className="trash-icon" aria-label="remove" /> Fjern betingelse
                        </button>
                    </div>
                );
            })}
            <button
                className="question-button"
                onClick={() => {
                    const ews = getItem(linkId).enableWhen;
                    const copy: QuestionnaireItemEnableWhen[] = ews ? ews : [];
                    dispatchUpdateItemEnableWhen(copy.concat({} as QuestionnaireItemEnableWhen));
                }}
            >
                <i className="add-icon" aria-label="icon" /> Legg til betingelse
            </button>
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
                    enableBehavior={getItem(linkId).enableBehavior as QuestionnaireItemEnableBehaviorCodes}
                />
            )}
        </>
    );
};

export default EnableWhen;
