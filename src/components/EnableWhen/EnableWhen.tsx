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
import {
    enableWhenOperator,
    enableWhenOperatorBoolean,
    enableWhenOperatorChoice,
    enableWhenOperatorDate,
} from '../../helpers/QuestionHelper';

import EnableBehavior from './EnableBehavior';
import EnableWhenAnswerTypes from './EnableWhenAnswerTypes';
import EnableWhenInfoBox from './EnableWhenInfoBox';
import FormField from '../FormField/FormField';
import PlusIcon from '../../images/icons/add-circle-outline.svg';
import Select from '../Select/Select';
import Trashcan from '../../images/icons/trash-outline.svg';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateItemAction } from '../../store/treeStore/treeActions';

type Props = {
    getItem: (linkId: string) => QuestionnaireItem;
    conditionalArray: ValueSetComposeIncludeConcept[];
    linkId: string;
    enableWhen: QuestionnaireItemEnableWhen[];
    containedResources?: Array<ValueSet>;
};

const EnableWhen = ({ getItem, conditionalArray, linkId, enableWhen, containedResources }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const dispatchUpdateItemEnableWhen = (value: QuestionnaireItemEnableWhen[] | undefined) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableWhen, value));
    };
    const dispatchUpdateItemEnableBehavior = (value: QuestionnaireItemEnableBehaviorCodes | undefined) => {
        dispatch(updateItemAction(linkId, IItemProperty.enableBehavior, value));
    };

    const getOperatorsForType = (qType: string): ValueSetComposeIncludeConcept[] => {
        if (qType === IQuestionnaireItemType.boolean) {
            return enableWhenOperatorBoolean;
        } else if (qType === IQuestionnaireItemType.choice || qType === IQuestionnaireItemType.openChoice) {
            return enableWhenOperatorChoice;
        } else if (qType === IQuestionnaireItemType.date || qType === IQuestionnaireItemType.dateTime) {
            return enableWhenOperatorDate;
        }
        return enableWhenOperator;
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
                return (
                    // we cannot use index as key, since we can also delete elements. Try to find a better index...
                    <div key={`${linkId}-${x.question}-${x.operator}-${index}`} className="enablewhen-box">
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
                                            <Select
                                                placeholder="Velg en operator"
                                                options={getOperatorsForType(conditionItem.type)}
                                                value={x.operator}
                                                onChange={(event) => {
                                                    const copy = getItem(linkId).enableWhen?.map((x, ewIndex) => {
                                                        let item = x;
                                                        if (
                                                            index === ewIndex &&
                                                            event.target.value === IOperator.exists
                                                        ) {
                                                            // remove answer[x] if operator is changed to exists
                                                            item = {
                                                                question: x.question,
                                                                operator: event.target.value,
                                                            } as QuestionnaireItemEnableWhen;
                                                        } else if (index === ewIndex) {
                                                            item = { ...x, operator: event.target.value };
                                                        }
                                                        return item;
                                                    });
                                                    dispatchUpdateItemEnableWhen(copy);
                                                }}
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
                            <img src={Trashcan} height="25" width="25" /> Fjern betingelse
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
                <img src={PlusIcon} height="25" width="25" /> Legg til betingelse
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
