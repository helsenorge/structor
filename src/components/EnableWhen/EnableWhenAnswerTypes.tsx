import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { format, parse, formatISO, parseISO } from 'date-fns';
import {
    QuestionnaireItem,
    QuestionnaireItemEnableWhen,
    ValueSet,
    ValueSetComposeIncludeConcept,
} from '../../types/fhir';
import { IExtentionType, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import Picker from '../DatePicker/DatePicker';
import DateTimePicker from '../DatePicker/DateTimePicker';
import Select from '../Select/Select';
import { TreeContext } from '../../store/treeStore/treeStore';
import { isRecipientList } from '../../helpers/QuestionHelper';
import InputField from '../InputField/inputField';
import { isItemControlReceiverComponent } from '../../helpers/itemControl';
import { getValueSetValues } from '../../helpers/valueSetHelper';

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
    const { t } = useTranslation();
    const { qContained } = state;

    const getRecipients = (item: QuestionnaireItem): ValueSetComposeIncludeConcept[] => {
        return (
            item.extension
                ?.filter((ext) => ext.url === IExtentionType.optionReference)
                .map((ext) => {
                    return { code: ext.valueReference?.reference || '', display: ext.valueReference?.display };
                }) || []
        );
    };

    const getChoices = (item: QuestionnaireItem): ValueSetComposeIncludeConcept[] => {
        if (item.answerOption) {
            return item.answerOption.map((x) => {
                return { code: x.valueCoding?.code || '', display: x.valueCoding?.display };
            });
        } else if (item.answerValueSet && containedResources) {
            const valueSet = containedResources.find((x) => `#${x.id}` === item.answerValueSet);
            return getValueSetValues(valueSet).map((coding) => {
                return { code: coding.code || '', display: coding.display };
            });
        }
        return [];
    };

    const getSystem = (codeValue: string): string | undefined => {
        if (conditionItem.answerValueSet) {
            const valueSet = qContained?.find((x) => x.id === conditionItem.answerValueSet?.replace('#', ''));
            return getValueSetValues(valueSet).find((x) => x.code === codeValue)?.system;
        } else {
            return conditionItem.answerOption?.find((x) => x.valueCoding?.code === codeValue)?.valueCoding?.system;
        }
    };

    const getSelectedChoiceValue = (): string | undefined => {
        const selectedValue = enableWhen.answerCoding?.code;
        const system = getSystem(selectedValue || '');
        const systemMatch = !!system && system === enableWhen.answerCoding?.system;
        return systemMatch ? getChoices(conditionItem).find((x) => x.code === selectedValue)?.code : undefined;
    };

    const getSelectedRecipient = (): string | undefined => {
        const selectedValue = enableWhen.answerReference?.reference;
        return getRecipients(conditionItem).find((x) => x.code === selectedValue)?.code;
    };

    return (
        <>
            {isItemControlReceiverComponent(conditionItem) && (
                <InputField
                    defaultValue={enableWhen.answerReference?.reference || ''}
                    onBlur={(event) => {
                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex
                                ? {
                                      ...x,
                                      answerReference: {
                                          reference: event.target.value,
                                      },
                                  }
                                : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {isRecipientList(conditionItem) && (
                <Select
                    placeholder={t('Choose an option..')}
                    options={getRecipients(conditionItem)}
                    value={getSelectedRecipient()}
                    onChange={(event) => {
                        const getUpdatedEnableWhen = (ew: QuestionnaireItemEnableWhen, value: string) => {
                            return {
                                ...ew,
                                answerReference: {
                                    reference: value,
                                },
                            };
                        };

                        const copy = itemEnableWhen?.map((x, ewIndex) => {
                            return index === ewIndex ? getUpdatedEnableWhen(x, event.target.value) : x;
                        });
                        dispatchUpdateItemEnableWhen(copy);
                    }}
                />
            )}
            {!isRecipientList(conditionItem) &&
                !isItemControlReceiverComponent(conditionItem) &&
                (conditionItem.type === IQuestionnaireItemType.choice ||
                    conditionItem.type === IQuestionnaireItemType.openChoice) && (
                    <Select
                        placeholder={t('Choose an option..')}
                        options={getChoices(conditionItem)}
                        value={getSelectedChoiceValue()}
                        onChange={(event) => {
                            const getUpdatedEnableWhen = (ew: QuestionnaireItemEnableWhen, value: string) => {
                                return {
                                    ...ew,
                                    answerCoding: {
                                        system: getSystem(event.target.value),
                                        code: value,
                                    },
                                };
                            };

                            const copy = itemEnableWhen?.map((x, ewIndex) => {
                                return index === ewIndex ? getUpdatedEnableWhen(x, event.target.value) : x;
                            });
                            dispatchUpdateItemEnableWhen(copy);
                        }}
                    />
                )}
            {conditionItem.type === IQuestionnaireItemType.boolean && (
                <Select
                    placeholder={t('Choose an option..')}
                    options={[
                        { display: t('True'), code: 'true' },
                        { display: t('Not true'), code: 'false' },
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
                            (x) => x.url === IExtentionType.questionnaireUnit,
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
                <InputField
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
