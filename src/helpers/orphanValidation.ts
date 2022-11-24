import { TFunction } from 'react-i18next';
import { Items, OrderItem, Languages } from '../store/treeStore/treeStore';
import { QuestionnaireItem, ValueSet } from '../types/fhir';
import { IExtentionType, IOperator, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import {
    ItemControlType,
    isItemControlHelp,
    isItemControlHighlight,
    isItemControlInline,
    isItemControlSidebar,
    isItemControlDataReceiver,
} from './itemControl';
import { hasExtension } from './extensionHelper';
import { isRecipientList } from './QuestionHelper';
import { isUriValid } from './uriHelper';
import { getValueSetValues } from './valueSetHelper';

export interface ValidationErrors {
    linkId: string;
    index?: number;
    errorProperty: string;
    errorReadableText: string;
}

const validEnableWhenChoiceOperators = [IOperator.equal, IOperator.notEqual];

const createError = (linkId: string, errorProperty: string, errorText: string, index?: number): ValidationErrors => {
    return {
        linkId: linkId,
        index: index,
        errorProperty: errorProperty,
        errorReadableText: errorText,
    };
};

const validateUniqueLinkId = (
    t: TFunction<'translation'>,
    qItems: Items,
    qItem: QuestionnaireItem,
): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    const hasLinkIdCollision = Object.keys(qItems).filter((x) => x === qItem.linkId).length > 1;
    if (hasLinkIdCollision) {
        returnErrors.push(createError(qItem.linkId, 'linkId', t('LinkId is already in use')));
    }
    return returnErrors;
};

const validateRequiredItem = (t: TFunction<'translation'>, qItem: QuestionnaireItem): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    if (
        (qItem.type === IQuestionnaireItemType.group ||
            qItem.type === IQuestionnaireItemType.display ||
            isItemControlInline(qItem) ||
            isItemControlHighlight(qItem) ||
            isItemControlHelp(qItem) ||
            isItemControlSidebar(qItem)) &&
        qItem.required
    ) {
        returnErrors.push(createError(qItem.linkId, 'required', t('Question is required, but cannot be required')));
    }
    return returnErrors;
};

const validateFhirpathDateValidation = (t: TFunction<'translation'>, qItem: QuestionnaireItem): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    if (qItem.type === IQuestionnaireItemType.date || qItem.type === IQuestionnaireItemType.dateTime) {
        (qItem.extension || []).forEach((extension, index) => {
            const isFhirPathExtension =
                extension.url === IExtentionType.fhirPathMinValue || extension.url === IExtentionType.fhirPathMaxValue;
            if (
                isFhirPathExtension &&
                extension.valueString?.split(' ').filter(Boolean).length !== 1 &&
                extension.valueString?.split(' ').filter(Boolean).length !== 4
            ) {
                returnErrors.push(
                    createError(qItem.linkId, 'extension', t('Error in FHIRpath date validation'), index),
                );
            }
        });
    }
    return returnErrors;
};

const validateItemCode = (t: TFunction<'translation'>, qItem: QuestionnaireItem): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    (qItem.code || []).forEach((code, index) => {
        if (!code.code) {
            returnErrors.push(createError(qItem.linkId, 'code.code', t('Code does not have "code" property'), index));
        }
        if (!code.system) {
            returnErrors.push(
                createError(qItem.linkId, 'code.system', t('Code does not have "system" property'), index),
            );
        }
        if (code.system && !isUriValid(code.system)) {
            returnErrors.push(createError(qItem.linkId, 'code', t('Code does not have a valid system'), index));
        }
    });
    return returnErrors;
};

const validateAnswerOptionSystem = (t: TFunction<'translation'>, qItem: QuestionnaireItem): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    (qItem.answerOption || []).forEach((answerOption, index) => {
        if (answerOption.valueCoding?.system && !isUriValid(answerOption.valueCoding?.system)) {
            returnErrors.push(createError(qItem.linkId, 'code', t('answerOption does not have a valid system'), index));
        }
    });
    return returnErrors;
};

const validateQuantitySystemAndCode = (t: TFunction<'translation'>, qItem: QuestionnaireItem): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    if (qItem.type === IQuestionnaireItemType.quantity) {
        const unitExtension = (qItem.extension || []).find((x) => x.url === IExtentionType.questionnaireUnit);
        if (unitExtension && unitExtension.valueCoding?.system && !isUriValid(unitExtension.valueCoding?.system)) {
            returnErrors.push(createError(qItem.linkId, 'code', t('quantity extension does not have a valid system')));
        }
        if (unitExtension && !unitExtension.valueCoding?.code) {
            returnErrors.push(createError(qItem.linkId, 'code', t('quantity extension does not have code')));
        }
    }
    return returnErrors;
};

const validateExtensions = (t: TFunction<'translation'>, qItem: QuestionnaireItem): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    (qItem.extension || []).forEach((extension, index) => {
        if (Object.keys(extension).indexOf('url') === -1) {
            // extension without url
            returnErrors.push(createError(qItem.linkId, 'extension', t('Extension has no "url" property'), index));
        }
        const valueProps = Object.keys(extension).filter((key) => key.substr(0, 5) === 'value');
        if (valueProps.length !== 1) {
            // extension with wrong number of value[x]
            returnErrors.push(
                createError(
                    qItem.linkId,
                    'extension',
                    t('Extension does not have value[x], or has more than one value[x]'),
                    index,
                ),
            );
        }
    });
    return returnErrors;
};

const validateInitial = (
    t: TFunction<'translation'>,
    qItem: QuestionnaireItem,
    qContained: ValueSet[],
): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    if (qItem.initial && qItem.initial[0].valueCoding) {
        if (qItem.answerOption) {
            const isMatch = qItem.answerOption.find(
                (x) =>
                    qItem.initial &&
                    qItem.initial[0] &&
                    qItem.initial[0].valueCoding?.code === x.valueCoding?.code &&
                    qItem.initial[0].valueCoding?.system === x.valueCoding?.system,
            );
            if (!isMatch) {
                returnErrors.push(createError(qItem.linkId, 'initial', t('Initial value is not a possible value')));
            }
        } else if (qItem.answerValueSet) {
            const valueSetToCheck = qContained.find((x) => `#${x.id}` === qItem.answerValueSet);
            if (valueSetToCheck) {
                const isMatch = getValueSetValues(valueSetToCheck).find(
                    (x) =>
                        qItem.initial &&
                        qItem.initial[0] &&
                        qItem.initial[0].valueCoding?.code === x.code &&
                        qItem.initial[0].valueCoding?.system === x.system,
                );
                if (!isMatch) {
                    returnErrors.push(createError(qItem.linkId, 'initial', t('Initial value is not a possible value')));
                }
            } else {
                // valueSet does not exist
                returnErrors.push(createError(qItem.linkId, 'initial', t('ValueSet of initial value does not exist')));
            }
        }
    }
    return returnErrors;
};

const validateEnableWhen = (
    t: TFunction<'translation'>,
    qItems: Items,
    qItem: QuestionnaireItem,
    qContained: ValueSet[],
): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    qItem.enableWhen?.forEach((ew, index) => {
        // does the question exist?
        const itemExists = !!qItems[ew.question];
        if (!itemExists) {
            returnErrors.push(
                createError(
                    qItem.linkId,
                    'enableWhen.question',
                    t('This enableWhen refers to a question with linkId which does not exist'),
                    index,
                ),
            );
        }

        // does enableWhen object have the correct keys?
        if (Object.keys(ew).length !== 3) {
            returnErrors.push(
                createError(
                    qItem.linkId,
                    'enableWhen',
                    t('enableWhen is not configured correctly. There are too many answer[x]-properties'),
                    index,
                ),
            );
        }

        // does the quantity system and code match?
        if (itemExists && qItems[ew.question].type === IQuestionnaireItemType.quantity) {
            const quantityExtension = qItems[ew.question].extension?.find(
                (x) => x.url === IExtentionType.questionnaireUnit,
            );

            const isMatch =
                quantityExtension &&
                ew.answerQuantity.system === quantityExtension.valueCoding?.system &&
                ew.answerQuantity.code === quantityExtension.valueCoding?.code;

            if (!isMatch) {
                returnErrors.push(
                    createError(
                        qItem.linkId,
                        'enableWhen.answerQuantity',
                        t('Quantity does not match system and code'),
                        index,
                    ),
                );
            }
        }

        // if choice, does the Coding exist (or reference if question item is mottaker)?
        if (
            itemExists &&
            (qItems[ew.question].type === IQuestionnaireItemType.choice ||
                qItems[ew.question].type === IQuestionnaireItemType.openChoice)
        ) {
            if (isRecipientList(qItems[ew.question]) && ew.operator !== IOperator.exists) {
                // does the reference exist?
                const isMatch = qItems[ew.question].extension?.find(
                    (x) => x.valueReference?.reference === ew.answerReference.reference,
                );
                if (!isMatch) {
                    returnErrors.push(
                        createError(
                            qItem.linkId,
                            'enableWhen.answerReference',
                            t('Recipient set in this enableWhen does not exist'),
                            index,
                        ),
                    );
                }
            } else if (qItems[ew.question].answerOption && ew.operator !== IOperator.exists) {
                if (validEnableWhenChoiceOperators.indexOf(ew.operator as IOperator) === -1) {
                    returnErrors.push(
                        createError(
                            qItem.linkId,
                            'enableWhen.operator',
                            t('Operator used in this enableWhen is not supported'),
                            index,
                        ),
                    );
                } else {
                    const isMatch = qItems[ew.question].answerOption?.find(
                        (x) =>
                            x.valueCoding?.system === ew.answerCoding.system &&
                            x.valueCoding?.code === ew.answerCoding.code,
                    );
                    if (!isMatch) {
                        returnErrors.push(
                            createError(
                                qItem.linkId,
                                'enableWhen.answerCoding',
                                t('Coding expected in this enableWhen does not exist'),
                                index,
                            ),
                        );
                    }
                }
            } else if (qItems[ew.question].answerValueSet && ew.operator !== IOperator.exists) {
                if (validEnableWhenChoiceOperators.indexOf(ew.operator as IOperator) === -1) {
                    returnErrors.push(
                        createError(
                            qItem.linkId,
                            'enableWhen.operator',
                            t('Operator used in this enableWhen is not supported'),
                            index,
                        ),
                    );
                } else {
                    // check contained valueSets
                    const valueSetToCheck = qContained.find((x) => `#${x.id}` === qItems[ew.question].answerValueSet);
                    if (valueSetToCheck) {
                        const isMatch = getValueSetValues(valueSetToCheck).find(
                            (x) =>
                                ew.answerCoding &&
                                x.code === ew.answerCoding.code &&
                                x.system === ew.answerCoding.system,
                        );
                        if (!isMatch) {
                            returnErrors.push(
                                createError(
                                    qItem.linkId,
                                    'enableWhen.answerCoding',
                                    t('Coding expected in this enableWhen does not exist'),
                                    index,
                                ),
                            );
                        }
                    } else {
                        // valueSet does not exist
                        returnErrors.push(
                            createError(
                                qItem.linkId,
                                'enableWhen.answerCoding',
                                t('The ValueSet referenced in this enableWhen does not exist'),
                                index,
                            ),
                        );
                    }
                }
            }
        }
    });
    return returnErrors;
};

const validateDataReceiver = (t: TFunction<'translation'>, qItem: QuestionnaireItem): ValidationErrors[] => {
    const returnErrors: ValidationErrors[] = [];
    if (isItemControlDataReceiver(qItem)) {
        if (!hasExtension(qItem, IExtentionType.copyExpression)) {
            returnErrors.push(
                createError(qItem.linkId, 'data-receiver', t('data receiver does not have an earlier question')),
            );
        }
    }
    return returnErrors;
};

export const validateOrphanedElements = (
    t: TFunction<'translation'>,
    qOrder: OrderItem[],
    qItems: Items,
    qContained: ValueSet[],
): ValidationErrors[] => {
    const errors: ValidationErrors[] = [];

    qOrder.forEach((x) => validate(t, x, qItems, qContained, errors));

    return errors;
};

const validate = (
    t: TFunction<'translation'>,
    currentItem: OrderItem,
    qItems: Items,
    qContained: ValueSet[],
    errors: ValidationErrors[],
): void => {
    const qItem = qItems[currentItem.linkId];

    // validate that this item has a unique linkId:
    errors.push(...validateUniqueLinkId(t, qItems, qItem));

    // validate required item which cannot have an answer
    errors.push(...validateRequiredItem(t, qItem));

    // validate fhirpath date extensions
    errors.push(...validateFhirpathDateValidation(t, qItem));

    // validate item.code
    errors.push(...validateItemCode(t, qItem));

    // validate system in answerOptions
    errors.push(...validateAnswerOptionSystem(t, qItem));

    // validate system+code in quantity
    errors.push(...validateQuantitySystemAndCode(t, qItem));

    // validate dead extensions
    errors.push(...validateExtensions(t, qItem));

    // validate initial for Coding (choice + open-choice):
    errors.push(...validateInitial(t, qItem, qContained));

    // validate enableWhen
    errors.push(...validateEnableWhen(t, qItems, qItem, qContained));

    // validate data-receiver
    errors.push(...validateDataReceiver(t, qItem));

    currentItem.items.forEach((x) => validate(t, x, qItems, qContained, errors));
};

const validateSidebarTranslations = (
    t: TFunction<'translation'>,
    currentItem: OrderItem,
    qAdditionalLanguages: Languages,
    errors: ValidationErrors[],
) => {
    const languageCodes = Object.keys(qAdditionalLanguages);
    languageCodes.forEach((languageCode, index) => {
        if (
            !qAdditionalLanguages[languageCode].sidebarItems[currentItem.linkId] ||
            !qAdditionalLanguages[languageCode].sidebarItems[currentItem.linkId].markdown
        ) {
            errors.push(
                createError(currentItem.linkId, 'sidebar.markdown', t('Translation not found for sidebar item'), index),
            );
        }
    });
};

const validateElementTranslations = (
    t: TFunction<'translation'>,
    currentItem: OrderItem,
    qAdditionalLanguages: Languages,
    errors: ValidationErrors[],
) => {
    const languageCodes = Object.keys(qAdditionalLanguages);
    languageCodes.forEach((languageCode, index) => {
        if (
            !qAdditionalLanguages[languageCode].items[currentItem.linkId] ||
            !qAdditionalLanguages[languageCode].items[currentItem.linkId].text
        ) {
            errors.push(createError(currentItem.linkId, 'items.text', t('Translation not found for form item'), index));
        }
    });
};

export const validateTranslations = (
    t: TFunction<'translation'>,
    qOrder: OrderItem[],
    qItems: Items,
    qAdditionalLanguages: Languages | undefined,
): ValidationErrors[] => {
    const translationErrors: ValidationErrors[] = [];

    if (qAdditionalLanguages) {
        const sidebarItems = qOrder.filter(
            (qOrderItem) =>
                qItems[qOrderItem.linkId].type === IQuestionnaireItemType.text &&
                qItems[qOrderItem.linkId].extension
                    ?.find((ex) => ex.url === IExtentionType.itemControl)
                    ?.valueCodeableConcept?.coding?.find((y) => y.code === ItemControlType.sidebar),
        );
        sidebarItems.forEach((item) => validateSidebarTranslations(t, item, qAdditionalLanguages, translationErrors));

        const elementItems = qOrder.filter(
            (qOrderItem) =>
                !qItems[qOrderItem.linkId].extension
                    ?.find((ex) => ex.url === IExtentionType.itemControl)
                    ?.valueCodeableConcept?.coding?.find((y) => y.code === ItemControlType.sidebar),
        );

        elementItems.forEach((item) => validateElementTranslations(t, item, qAdditionalLanguages, translationErrors));
    }

    return translationErrors;
};
