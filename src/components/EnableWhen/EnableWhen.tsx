import React, { useContext } from 'react';
import {
    QuestionnaireItem,
    QuestionnaireItemEnableBehaviorCodes,
    QuestionnaireItemEnableWhen,
    ValueSet,
    ValueSetComposeIncludeConcept,
} from '../../types/fhir';
import Trashcan from '../../images/icons/trash-outline.svg';
import PlusIcon from '../../images/icons/add-circle-outline.svg';
import { IItemProperty, IOperator, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import Select from '../Select/Select';
import { updateItemAction } from '../../store/treeStore/treeActions';
import { TreeContext } from '../../store/treeStore/treeStore';
import './EnableWhen.css';
import EnableWhenInfoBox from './EnableWhenInfoBox';
import {
    enableWhenOperator,
    enableWhenOperatorBoolean,
    enableWhenOperatorChoice,
    enableWhenOperatorDate,
} from '../../helpers/QuestionHelper';
import FormField from '../FormField/FormField';
import EnableBehavior from './EnableBehavior';
import EnableWhenAnswerTypes from './EnableWhenAnswerTypes';

type Props = {
    getItem: (linkId: string) => QuestionnaireItem;
    conditionalArray: {
        code: string;
        display: string;
    }[];
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

    return (
        <>
            <p>
                Hvis relevansen for dette spørsmålet er avhgengig av svaret på et eller flere tidligere spørsmål, velges
                dette her.
            </p>
            {enableWhen.map((x, index) => {
                const conditionItem = getItem(x.question);
                return (
                    // we cannot use index as key, since we can also delete elements. Try to find a better index...
                    <div key={`${linkId}-${x.question}-${x.operator}-${index}`} className="enablewhen-box">
                        <FormField label="Velg tidligere spørsmål:">
                            <Select
                                placeholder="Velg spørsmål"
                                options={conditionalArray}
                                value={x.question}
                                onChange={(event) => {
                                    const copy = getItem(linkId).enableWhen?.map((x, ewIndex) => {
                                        return index === ewIndex ? { ...x, question: event.target.value } : x;
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
                                                if (index === ewIndex && event.target.value === IOperator.exists) {
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
                    enableWhen={enableWhen}
                    containedResources={containedResources}
                    enableBehavior={getItem(linkId).enableBehavior as QuestionnaireItemEnableBehaviorCodes}
                />
            )}
        </>
    );
};

export default EnableWhen;
