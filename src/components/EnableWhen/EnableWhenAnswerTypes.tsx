import React, { useContext } from 'react';
import { format, parse, formatISO, parseISO } from 'date-fns';
import {
    QuestionnaireItem,
    QuestionnaireItemEnableWhen,
    ValueSet,
    ValueSetComposeIncludeConcept,
} from '../../types/fhir';
import { IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import Picker from '../DatePicker/DatePicker';
import DateTimePicker from '../DatePicker/DateTimePicker';
import Select from '../Select/Select';
import { TreeContext } from '../../store/treeStore/treeStore';

interface Props {
    conditionItem: QuestionnaireItem;
    index: number;
    enableWhen: QuestionnaireItemEnableWhen;
    itemEnableWhen: QuestionnaireItemEnableWhen[] | undefined;
    containedResources?: Array<ValueSet>;
    dispatchUpdateItemEnableWhen: (value: QuestionnaireItemEnableWhen[] | undefined) => void;
}

const EnableWhenAnswerTypes = ({
    conditionItem,
    index,
    enableWhen,
    itemEnableWhen,
    containedResources,
    dispatchUpdateItemEnableWhen,
}: Props): JSX.Element => {
    const { state } = useContext(TreeContext);
    const { qContained } = state;
    const getChoices = (conditionItem: QuestionnaireItem): ValueSetComposeIncludeConcept[] => {
        if (conditionItem.answerOption) {
            return conditionItem.answerOption.map((x) => {
                return { code: x.valueCoding?.code || '', display: x.valueCoding?.display };
            });
        } else if (conditionItem.answerValueSet && containedResources) {
            const valueSet = containedResources.find((x) => `#${x.id}` === conditionItem.answerValueSet);
            if (valueSet && valueSet.compose && valueSet.compose.include && valueSet.compose.include[0].concept) {
                return valueSet.compose.include[0].concept?.map((x) => {
                    return { code: x.code, display: x.display };
                });
            }
        }
        return [];
    };

    return (
        <>
            {(conditionItem.type === IQuestionnaireItemType.choice ||
                conditionItem.type === IQuestionnaireItemType.openChoice) && (
                <Select
                    placeholder="Velg et alternativ.."
                    options={getChoices(conditionItem)}
                    value={enableWhen.answerCoding?.code}
                    onChange={(event) => {
                        const getSystem = () => {
                            if (conditionItem.answerValueSet) {
                                return qContained?.find((x) => x.id === conditionItem.answerValueSet?.replace('#', ''))
                                    ?.compose?.include[0].system;
                            } else {
                                return conditionItem.answerOption?.find(
                                    (x) => x.valueCoding?.code === event.target.value,
                                )?.valueCoding?.system;
                            }
                        };

                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex
                                ? {
                                      ...x,
                                      answerCoding: {
                                          system: getSystem(),
                                          code: event.target.value,
                                      },
                                  }
                                : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {conditionItem.type === IQuestionnaireItemType.boolean && (
                <Select
                    placeholder="Velg et alternativ.."
                    options={[
                        { display: 'Sant', code: 'true' },
                        { display: 'Usant', code: 'false' },
                    ]}
                    value={(enableWhen.answerBoolean || '').toString()}
                    onChange={(event) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex
                                ? {
                                      ...x,
                                      answerBoolean: event.target.value === 'true' ? true : false,
                                  }
                                : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {conditionItem.type === IQuestionnaireItemType.date && (
                <Picker
                    selected={
                        enableWhen.answerDate ? parse(enableWhen.answerDate, 'yyyy-MM-dd', new Date()) : undefined
                    }
                    disabled={false}
                    withPortal
                    type="date"
                    callback={(date: Date) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex ? { ...x, answerDate: format(date, 'yyyy-MM-dd') } : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {conditionItem.type === IQuestionnaireItemType.dateTime && (
                <DateTimePicker
                    selected={enableWhen.answerDateTime ? parseISO(enableWhen.answerDateTime) : undefined}
                    disabled={false}
                    withPortal
                    callback={(date: Date) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex ? { ...x, answerDateTime: formatISO(date) } : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {conditionItem.type === IQuestionnaireItemType.time && (
                <Picker
                    selected={enableWhen.answerTime ? parse(enableWhen.answerTime, 'HH:mm:ss', new Date()) : undefined}
                    type="time"
                    disabled={false}
                    withPortal
                    callback={(date: Date) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex ? { ...x, answerTime: format(date, 'HH:mm:ss') } : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {conditionItem.type === IQuestionnaireItemType.integer && (
                <input
                    type="number"
                    defaultValue={enableWhen.answerInteger}
                    onBlur={(event) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex ? { ...x, answerInteger: parseInt(event.target.value, 10) } : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {conditionItem.type === IQuestionnaireItemType.decimal && (
                <input
                    type="number"
                    defaultValue={enableWhen.answerDecimal}
                    onBlur={(event) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex ? { ...x, answerDecimal: parseFloat(event.target.value) } : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {conditionItem.type === IQuestionnaireItemType.quantity && (
                <input
                    type="number"
                    defaultValue={enableWhen.answerQuantity ? enableWhen.answerQuantity.value : ''}
                    onBlur={(event) => {
                        const extension = (conditionItem.extension || []).find(
                            (x) => x.url === 'http://hl7.org/fhir/StructureDefinition/questionnaire-unit',
                        );
                        // get code and system from extension
                        const system = extension ? extension.valueCoding?.system : '';
                        const code = extension ? extension.valueCoding?.code : '';
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex
                                ? {
                                      ...x,
                                      answerQuantity: {
                                          value: parseFloat(event.target.value),
                                          system: system,
                                          code: code,
                                      },
                                  }
                                : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {(conditionItem.type === IQuestionnaireItemType.string ||
                conditionItem.type === IQuestionnaireItemType.text) && (
                <input
                    defaultValue={enableWhen.answerString || ''}
                    onBlur={(event) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex ? { ...x, answerString: event.target.value } : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
        </>
    );
};

export default EnableWhenAnswerTypes;
