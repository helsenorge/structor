import { TFunction } from 'react-i18next';
import { Items, OrderItem } from '../store/treeStore/treeStore';
import { ValueSet } from '../types/fhir';
import { IExtentionType, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { isItemControlHelp, isItemControlHighlight, isItemControlInline, isItemControlSidebar } from './itemControl';
import { isRecipientList } from './QuestionHelper';
import { isSystemValid } from './systemHelper';

export interface ValidationErrors {
    linkId: string;
    index?: number;
    errorProperty: string;
    errorReadableText: string;
}

export const validateOrphanedElements = (
    t: TFunction<'translation'>,
    qOrder: OrderItem[],
    qItems: Items,
    qContained: ValueSet[],
): ValidationErrors[] => {
    const errors: ValidationErrors[] = [];

    qOrder.forEach((x) => validate(t, x, qItems, qContained, errors));
    console.log(errors);
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
    const hasLinkIdCollision = Object.keys(qItems).filter((x) => x === qItem.linkId).length > 1;
    if (hasLinkIdCollision) {
        errors.push({
            linkId: qItem.linkId,
            errorProperty: 'linkId',
            errorReadableText: t('LinkId is already in use'),
        });
    }

    // validate required item which cannot have an answer
    if (
        (qItem.type === IQuestionnaireItemType.group ||
            qItem.type === IQuestionnaireItemType.display ||
            isItemControlInline(qItem) ||
            isItemControlHighlight(qItem) ||
            isItemControlHelp(qItem) ||
            isItemControlSidebar(qItem)) &&
        qItem.required
    ) {
        errors.push({
            linkId: qItem.linkId,
            errorProperty: 'required',
            errorReadableText: t('Question is required, but cannot be required'),
        });
    }

    // validate fhirpath date extensions
    if (qItem.type === IQuestionnaireItemType.date || qItem.type === IQuestionnaireItemType.dateTime) {
        (qItem.extension || []).forEach((extension, index) => {
            const isFhirPathExtension =
                extension.url === IExtentionType.fhirPathMinValue || extension.url === IExtentionType.fhirPathMaxValue;
            if (
                isFhirPathExtension &&
                extension.valueString?.split(' ').filter(Boolean).length !== 1 &&
                extension.valueString?.split(' ').filter(Boolean).length !== 4
            ) {
                errors.push({
                    linkId: qItem.linkId,
                    index: index,
                    errorProperty: 'extension',
                    errorReadableText: t('Error in FHIRpath date validation'),
                });
            }
        });
    }

    // validate item.code
    (qItem.code || []).forEach((code, index) => {
        if (!code.code) {
            errors.push({
                linkId: qItem.linkId,
                index: index,
                errorProperty: 'code.code',
                errorReadableText: t('Code does not have "code" property'),
            });
        }
        if (!code.system) {
            errors.push({
                linkId: qItem.linkId,
                index: index,
                errorProperty: 'code.system',
                errorReadableText: 'Code does not have "system" property',
            });
        }
        if (code.system && !isSystemValid(code.system)) {
            errors.push({
                linkId: qItem.linkId,
                index: index,
                errorProperty: 'code',
                errorReadableText: t('Code does not have a valid system'),
            });
        }
    });

    // validate system in answerOptions
    (qItem.answerOption || []).forEach((answerOption, index) => {
        if (answerOption.valueCoding?.system && !isSystemValid(answerOption.valueCoding?.system)) {
            errors.push({
                linkId: qItem.linkId,
                index: index,
                errorProperty: 'code',
                errorReadableText: t('answerOption does not have a valid system'),
            });
        }
    });

    // validate system+code in quantity
    if (qItem.type === IQuestionnaireItemType.quantity) {
        const unitExtension = (qItem.extension || []).find((x) => x.url === IExtentionType.questionnaireUnit);
        if (unitExtension && unitExtension.valueCoding?.system && !isSystemValid(unitExtension.valueCoding?.system)) {
            errors.push({
                linkId: qItem.linkId,
                errorProperty: 'code',
                errorReadableText: t('quantity extension does not have a valid system'),
            });
        }
        if (unitExtension && !unitExtension.valueCoding?.code) {
            errors.push({
                linkId: qItem.linkId,
                errorProperty: 'code',
                errorReadableText: t('quantity extension does not have code'),
            });
        }
    }

    // validate dead extensions
    (qItem.extension || []).forEach((extension, index) => {
        if (Object.keys(extension).indexOf('url') === -1) {
            // extension without url
            errors.push({
                linkId: qItem.linkId,
                index: index,
                errorProperty: 'extension',
                errorReadableText: t('Extension has no "url" property'),
            });
        }
        const valueProps = Object.keys(extension).filter((key) => key.substr(0, 5) === 'value');
        if (valueProps.length !== 1) {
            // extension with wrong number of value[x]
            errors.push({
                linkId: qItem.linkId,
                index: index,
                errorProperty: 'extension',
                errorReadableText: t('Extension does not have value[x], or has more than one value[x]'),
            });
        }
    });

    // validate initial for Coding (choice + open-choice):
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
                errors.push({
                    linkId: qItem.linkId,
                    errorProperty: 'initial',
                    errorReadableText: t('Initial value is not a possible value'),
                });
            }
        } else if (qItem.answerValueSet) {
            const valueSetToCheck = qContained.find((x) => `#${x.id}` === qItem.answerValueSet);
            if (valueSetToCheck) {
                const system = valueSetToCheck.compose?.include[0].system;
                const isMatch = valueSetToCheck.compose?.include[0].concept?.find(
                    (x) =>
                        qItem.initial &&
                        qItem.initial[0] &&
                        qItem.initial[0].valueCoding?.code === x.code &&
                        qItem.initial[0].valueCoding?.system === system,
                );
                if (!isMatch) {
                    errors.push({
                        linkId: qItem.linkId,
                        errorProperty: 'initial',
                        errorReadableText: t('Initial value is not a possible value'),
                    });
                }
            } else {
                // valueSet does not exist
                errors.push({
                    linkId: qItem.linkId,
                    errorProperty: 'initial',
                    errorReadableText: t('ValueSet of initial value does not exist'),
                });
            }
        }
    }

    // validate enableWhen
    qItem.enableWhen?.forEach((ew, index) => {
        // does the question exist?
        const itemExists = !!qItems[ew.question];
        if (!itemExists) {
            errors.push({
                linkId: qItem.linkId,
                index: index,
                errorProperty: 'enableWhen.question',
                errorReadableText: t('This enableWhen refers to a question with linkId which does not exist'),
            });
        }

        // does enableWhen object have the correct keys?
        if (Object.keys(ew).length !== 3) {
            errors.push({
                linkId: qItem.linkId,
                index: index,
                errorProperty: 'enableWhen',
                errorReadableText: t('enableWhen is not configured correctly. There are too many answer[x]-properties'),
            });
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
                errors.push({
                    linkId: qItem.linkId,
                    index: index,
                    errorProperty: 'enableWhen.answerQuantity',
                    errorReadableText: t('Quantity does not match system and code'),
                });
            }
        }

        // if choice, does the Coding exist (or reference if question item is mottaker)?
        if (
            itemExists &&
            (qItems[ew.question].type === IQuestionnaireItemType.choice ||
                qItems[ew.question].type === IQuestionnaireItemType.openChoice)
        ) {
            if (isRecipientList(qItems[ew.question])) {
                // does the reference exist?
                const isMatch = qItems[ew.question].extension?.find(
                    (x) => x.valueReference?.reference === ew.answerReference.reference,
                );
                if (!isMatch) {
                    errors.push({
                        linkId: qItem.linkId,
                        index: index,
                        errorProperty: 'enableWhen.answerReference',
                        errorReadableText: t('Recipient set in this enableWhen does not exist'),
                    });
                }
            } else if (qItems[ew.question].answerOption) {
                const isMatch = qItems[ew.question].answerOption?.find(
                    (x) =>
                        x.valueCoding?.system === ew.answerCoding.system &&
                        x.valueCoding?.code === ew.answerCoding.code,
                );
                if (!isMatch) {
                    errors.push({
                        linkId: qItem.linkId,
                        index: index,
                        errorProperty: 'enableWhen.answerCoding',
                        errorReadableText: t('Coding expected in this enableWhen does not exist'),
                    });
                }
            } else if (qItems[ew.question].answerValueSet) {
                // check contained valueSets
                const valueSetToCheck = qContained.find((x) => `#${x.id}` === qItems[ew.question].answerValueSet);
                if (valueSetToCheck) {
                    const system = valueSetToCheck.compose?.include[0].system;
                    const isMatch = valueSetToCheck.compose?.include[0].concept?.find(
                        (x) => ew.answerCoding && x.code === ew.answerCoding.code && system === ew.answerCoding.system,
                    );
                    if (!isMatch) {
                        errors.push({
                            linkId: qItem.linkId,
                            index: index,
                            errorProperty: 'enableWhen.answerCoding',
                            errorReadableText: t('Coding expected in this enableWhen does not exist'),
                        });
                    }
                } else {
                    // valueSet does not exist
                    errors.push({
                        linkId: qItem.linkId,
                        index: index,
                        errorProperty: 'enableWhen.answerCoding',
                        errorReadableText: t('The ValueSet referenced in this enableWhen does not exist'),
                    });
                }
            }
        }
    });

    currentItem.items.forEach((x) => validate(t, x, qItems, qContained, errors));
};
