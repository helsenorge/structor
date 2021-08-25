import React from 'react';
import { useTranslation } from 'react-i18next';
import { IOperator, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import Select from '../Select/Select';
import {
    enableWhenOperator,
    enableWhenOperatorBoolean,
    enableWhenOperatorChoice,
    enableWhenOperatorDate,
} from '../../helpers/QuestionHelper';
import { QuestionnaireItem, QuestionnaireItemEnableWhen, ValueSetComposeIncludeConcept } from '../../types/fhir';

interface EnableWhenOperatorProps {
    conditionItem: QuestionnaireItem;
    thisItem: QuestionnaireItem;
    ew: QuestionnaireItemEnableWhen;
    ewIndex: number;
    dispatchUpdateItemEnableWhen: (ews: QuestionnaireItemEnableWhen[] | undefined) => void;
}

const EnableWhenOperator = (props: EnableWhenOperatorProps): JSX.Element => {
    const { t } = useTranslation();
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

    const getSelectedOperator = (ew: QuestionnaireItemEnableWhen): string => {
        if (IOperator.exists && ew.answerBoolean === false) {
            return IOperator.notExists;
        }
        return ew.operator;
    };

    return (
        <Select
            placeholder={t('Select an operator')}
            options={getOperatorsForType(props.conditionItem.type)}
            value={getSelectedOperator(props.ew)}
            onChange={(event) => {
                const operator = event.target.value;
                const copy = props.thisItem.enableWhen?.map((ewCondition, ewIndex) => {
                    let item = { ...ewCondition };
                    if (
                        props.ewIndex === ewIndex &&
                        (operator === IOperator.exists || operator === IOperator.notExists)
                    ) {
                        // remove answer[x] if operator is changed to exists
                        item = {
                            question: ewCondition.question,
                            operator: IOperator.exists,
                            answerBoolean: operator === IOperator.exists,
                        } as QuestionnaireItemEnableWhen;
                    } else if (props.ewIndex === ewIndex) {
                        item.operator = operator;
                        if (item.answerBoolean) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-expect-error
                            delete item.answerBoolean;
                        }
                    }
                    return item;
                });
                props.dispatchUpdateItemEnableWhen(copy);
            }}
        />
    );
};

export default EnableWhenOperator;
