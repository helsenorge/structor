import React from 'react';
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
    const getChoices = (conditionItem: QuestionnaireItem): ValueSetComposeIncludeConcept[] => {
        if (conditionItem.answerOption) {
            return conditionItem.answerOption.map((x) => {
                return { code: x.valueCoding.code || '', display: x.valueCoding.display };
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
            {conditionItem.type === IQuestionnaireItemType.choice && (
                <Select
                    placeholder="Velg et alternativ.."
                    options={getChoices(conditionItem)}
                    value={enableWhen.answerCoding?.code}
                    onChange={(event) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex
                                ? {
                                      ...x,
                                      answerCoding: {
                                          system: conditionItem.answerOption?.find(
                                              (x) => x.valueCoding.code === event.target.value,
                                          )?.valueCoding.system,
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
        </>
    );
};

export default EnableWhenAnswerTypes;
