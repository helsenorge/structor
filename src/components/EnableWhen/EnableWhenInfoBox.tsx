import {
    Coding,
    Quantity,
    QuestionnaireItem,
    QuestionnaireItemEnableBehaviorCodes,
    QuestionnaireItemEnableWhen,
    ValueSet,
} from '../../types/fhir';

import { IOperator } from '../../types/IQuestionnareItemType';
import Infobox from './Infobox';
import React from 'react';
import { useTranslation } from 'react-i18next';
import createUUID from '../../helpers/CreateUUID';
import { format } from 'date-fns';

type OperatorMapType = {
    [key: string]: string;
};

const operatorMap: OperatorMapType = {
    [IOperator.exists]: 'exists',
    [IOperator.equal]: 'is equal to',
    [IOperator.notEqual]: 'is not equal',
    [IOperator.greaterThan]: 'is greater than',
    [IOperator.lessThan]: 'is less than',
    [IOperator.greaterThanOrEqual]: 'is greater than or equal',
    [IOperator.lessThanOrEqual]: 'is less than or equal',
};

interface Props {
    getItem: (linkId: string) => QuestionnaireItem;
    linkId: string;
    enableWhen: Array<QuestionnaireItemEnableWhen>;
    containedResources?: Array<ValueSet>;
    enableBehavior?: QuestionnaireItemEnableBehaviorCodes;
}

const EnableWhenInfoBox = ({ getItem, linkId, enableWhen, containedResources, enableBehavior }: Props): JSX.Element => {
    const { t } = useTranslation();
    const getCodingDisplay = (conditionLinkId: string, coding: Coding): string => {
        const item = getItem(conditionLinkId);
        let display: string | undefined;
        if (item.answerOption) {
            const codingItem = item.answerOption.find(
                (x) => x.valueCoding?.system === coding.system && x.valueCoding?.code === coding.code,
            );
            display = codingItem?.valueCoding?.display;
        } else if (item.answerValueSet && containedResources) {
            const valueSet = containedResources.find((x) => `#${x.id}` === item.answerValueSet);
            if (
                valueSet &&
                valueSet.compose &&
                valueSet.compose.include &&
                valueSet.compose.include[0].concept &&
                valueSet.compose.include[0].system === coding.system
            ) {
                const codingItem = valueSet.compose.include[0].concept.find((x) => x.code === coding.code);
                display = codingItem?.display;
            }
        }

        return display || t('<not set>');
    };

    const getQuantityDisplay = (answerQuantity: Quantity): string => {
        // TODO: vis riktig unit dersom den kommer fra extension
        let display: string | undefined = '';
        if (answerQuantity) {
            const unit = answerQuantity.unit;
            display = `${answerQuantity.value} ${unit ? unit : answerQuantity.code}`;
        }
        return display;
    };

    const generateCondition = (enableWhen: QuestionnaireItemEnableWhen, enableBehaviorText: string): JSX.Element => {
        if (!enableWhen.question) {
            return <div key={`${linkId}-empty-${createUUID()}`}></div>;
        }
        const conditionItem = getItem(enableWhen.question);
        if (!conditionItem) {
            // if this happens, this enableWhen refers to a question which does not exist
            console.warn(
                t('Error in enableWhen: item with linkId {0} does not exist').replace('{0}', enableWhen.question),
            );
            return (
                <div key={`${linkId}-${enableWhen.question}-${enableWhen.operator}-notfound`}>
                    {t('Error in enableWhen: item with linkId {0} does not exist').replace('{0}', enableWhen.question)}
                </div>
            );
        }

        let answerCondition: string;
        if (enableWhen.hasOwnProperty('answerBoolean')) {
            answerCondition = enableWhen.answerBoolean === true ? t('True') : t('Not true');
        } else if (enableWhen.hasOwnProperty('answerDecimal')) {
            answerCondition = enableWhen.answerDecimal.toString();
        } else if (enableWhen.hasOwnProperty('answerInteger')) {
            answerCondition = enableWhen.answerInteger.toString();
        } else if (enableWhen.hasOwnProperty('answerDate')) {
            answerCondition = format(new Date(enableWhen.answerDate), 'dd.MM.yyyy');
        } else if (enableWhen.hasOwnProperty('answerDateTime')) {
            answerCondition = format(new Date(enableWhen.answerDateTime), "dd.MM.yyyy' 'HH:mm");
        } else if (enableWhen.hasOwnProperty('answerTime')) {
            answerCondition = enableWhen.answerTime;
        } else if (enableWhen.hasOwnProperty('answerString')) {
            answerCondition = enableWhen.answerString;
        } else if (enableWhen.hasOwnProperty('answerCoding')) {
            answerCondition = getCodingDisplay(enableWhen.question, enableWhen.answerCoding);
        } else if (enableWhen.hasOwnProperty('answerQuantity')) {
            answerCondition = getQuantityDisplay(enableWhen.answerQuantity);
        } else if (enableWhen.hasOwnProperty('answerReference')) {
            answerCondition = enableWhen.answerReference.reference || ''; // TODO: show display of reference (read extension)
        } else {
            answerCondition = '';
        }

        return (
            <div key={`${linkId}-${enableWhen.question}-${enableWhen.operator}-${answerCondition}`}>
                {enableBehaviorText && <p>{enableBehaviorText}</p>}
                <strong>{getItem(enableWhen.question).text}</strong>{' '}
                {t(operatorMap[enableWhen.operator]) || t('<operator>')} <strong>{answerCondition}</strong>
            </div>
        );
    };
    const enableBehaviorText = enableBehavior === QuestionnaireItemEnableBehaviorCodes.ALL ? t('and') : t('or');

    return (
        <Infobox title={t('Element will be shown if:')}>
            {enableWhen.map((condition, index) => {
                return generateCondition(condition, index > 0 ? enableBehaviorText : '');
            })}
        </Infobox>
    );
};

export default EnableWhenInfoBox;
