import React from 'react';
import { useTranslation } from 'react-i18next';
import './Question.css';

import {
    Element,
    Extension,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    ValueSet,
    ValueSetComposeIncludeConcept,
} from '../../types/fhir';
import {
    IExtentionType,
    IItemProperty,
    IQuestionnaireItemType,
    IValueSetSystem,
} from '../../types/IQuestionnareItemType';

import {
    deleteChildItemsAction,
    newItemAction,
    removeItemAttributeAction,
    updateItemAction,
} from '../../store/treeStore/treeActions';
import itemType, {
    ATTACHMENT_DEFAULT_MAX_SIZE,
    isRecipientList,
    typeIsSupportingValidation,
    valueSetTqqcCoding,
} from '../../helpers/QuestionHelper';
import { createDropdown, removeItemExtension, setItemExtension } from '../../helpers/extensionHelper';
import { isItemControlInline, ItemControlType, isItemControlReceiverComponent } from '../../helpers/itemControl';

import Accordion from '../Accordion/Accordion';
import { ActionType } from '../../store/treeStore/treeStore';
import AdvancedQuestionOptions from '../AdvancedQuestionOptions/AdvancedQuestionOptions';
import Choice from './QuestionType/Choice';
import EnableWhen from '../EnableWhen/EnableWhen';
import Inline from './QuestionType/Inline';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import PredefinedValueSet from './QuestionType/PredefinedValueSet';
import Select from '../Select/Select';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import ValidationAnswerTypes from './ValidationAnswerTypes/ValidationAnswerTypes';
import Codes from '../AdvancedQuestionOptions/Code/Codes';
import OptionReference from './QuestionType/OptionReference';
import FormField from '../FormField/FormField';
import UnitTypeSelector from './UnitType/UnitTypeSelector';
import { DateType } from './QuestionType/DateType';
import { ValidationErrors } from '../../helpers/orphanValidation';

interface QuestionProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
    containedResources?: Array<ValueSet>;
    conditionalArray: ValueSetComposeIncludeConcept[];
    itemValidationErrors: ValidationErrors[];
    getItem: (linkId: string) => QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
}

const Question = (props: QuestionProps): JSX.Element => {
    const { t } = useTranslation();
    const [isMarkdownActivated, setIsMarkdownActivated] = React.useState<boolean>(!!props.item._text);
    const codeElements = props.item.code ? `(${props.item.code.length})` : '';

    const dispatchNewChildItem = (type?: IQuestionnaireItemType): void => {
        props.dispatch(newItemAction(type || IQuestionnaireItemType.group, [...props.parentArray, props.item.linkId]));
    };

    const dispatchUpdateItem = (
        name: IItemProperty,
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | Extension[] | undefined,
    ): void => {
        props.dispatch(updateItemAction(props.item.linkId, name, value));
    };

    const dispatchRemoveAttribute = (name: IItemProperty): void => {
        props.dispatch(removeItemAttributeAction(props.item.linkId, name));
    };

    const dispatchClearExtensions = (): void => {
        props.dispatch(updateItemAction(props.item.linkId, IItemProperty.extension, []));
    };

    const getLabelText = (): string => {
        let labelText = '';
        if (isMarkdownActivated) {
            labelText =
                props.item._text?.extension?.find((x) => x.url === IExtentionType.markdown)?.valueMarkdown || '';
        }
        return labelText || props.item.text || '';
    };

    const getSublabelText = (): string => {
        return props.item.extension?.find((x) => x.url === IExtentionType.sublabel)?.valueMarkdown || '';
    };

    const dispatchUpdateMarkdownLabel = (newLabel: string): void => {
        const markdownValue = {
            extension: [
                {
                    url: IExtentionType.markdown,
                    valueMarkdown: newLabel,
                },
            ],
        };

        dispatchUpdateItem(IItemProperty._text, markdownValue);
        // update text with same value. Text is used in condition in enableWhen
        dispatchUpdateItem(IItemProperty.text, newLabel);
    };

    const respondType = (param: string) => {
        if (props.item.answerValueSet && param === IQuestionnaireItemType.choice) {
            return <PredefinedValueSet item={props.item} selectedValueSet={props.item.answerValueSet} />;
        }
        if (isItemControlInline(props.item)) {
            return <Inline linkId={props.item.linkId} parentArray={props.parentArray} />;
        }

        if (isRecipientList(props.item)) {
            return <OptionReference item={props.item} />;
        }

        if (isItemControlReceiverComponent(props.item)) {
            return <></>;
        }

        switch (param) {
            case IQuestionnaireItemType.date:
                return (
                    <FormField>
                        <DateType item={props.item} dispatch={props.dispatch} />
                    </FormField>
                );
            case IQuestionnaireItemType.choice:
                return <Choice item={props.item} />;
            case IQuestionnaireItemType.openChoice:
                return <Choice item={props.item} />;
            case IQuestionnaireItemType.quantity:
                return <UnitTypeSelector item={props.item} />;
            default:
                return '';
        }
    };

    const handleDisplayQuestionType = () => {
        if (props.item.answerValueSet && props.item.type === IQuestionnaireItemType.choice) {
            return IQuestionnaireItemType.predefined;
        }
        if (props.item.type === IQuestionnaireItemType.integer || props.item.type === IQuestionnaireItemType.decimal) {
            return IQuestionnaireItemType.number;
        }

        if (isRecipientList(props.item)) {
            return IQuestionnaireItemType.receiver;
        }
        if (isItemControlReceiverComponent(props.item)) {
            return IQuestionnaireItemType.receiverComponent;
        }
        if (isItemControlInline(props.item)) {
            return IQuestionnaireItemType.inline;
        }
        return props.item.type;
    };

    const handleQuestionareTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const previousType = handleDisplayQuestionType();
        const newType = event.target.value;

        dispatchClearExtensions();
        addDefaultExtensionsAndAttributesForItemType(newType);
        cleanupChildItems(previousType);

        if (newType === IQuestionnaireItemType.predefined) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.choice);
            dispatchUpdateItem(IItemProperty.answerValueSet, '#');
            dispatchRemoveAttribute(IItemProperty.answerOption);
        } else if (newType === IQuestionnaireItemType.number) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.integer);
            dispatchRemoveAttribute(IItemProperty.answerValueSet);
        } else if (newType === IQuestionnaireItemType.receiver) {
            dispatchRemoveAttribute(IItemProperty.answerValueSet);
            dispatchRemoveAttribute(IItemProperty.answerOption);
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.choice);
        } else if (newType === IQuestionnaireItemType.receiverComponent) {
            const extension = {
                url: IExtentionType.itemControl,
                valueCodeableConcept: {
                    coding: [{ system: IValueSetSystem.itemControlValueSet, code: ItemControlType.receiverComponent }],
                },
            };

            setItemExtension(props.item, extension, props.dispatch);
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.choice);
            dispatchUpdateItem(IItemProperty.text, t('<Recipient component>') || '');
            dispatchUpdateItem(IItemProperty.answerValueSet, 'http://helsenorge.no/fhir/ValueSet/adresser');
            dispatchUpdateItem(IItemProperty.required, true);
            dispatchUpdateItem(IItemProperty.code, [valueSetTqqcCoding]);
            dispatchRemoveAttribute(IItemProperty.answerOption);
        } else if (newType === IQuestionnaireItemType.inline) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.text);
            dispatchNewChildItem(IQuestionnaireItemType.display);
        } else {
            dispatchUpdateItem(IItemProperty.type, newType);
            dispatchRemoveAttribute(IItemProperty.answerValueSet);
        }
    };

    function cleanupChildItems(previousType: string) {
        if (
            previousType === IQuestionnaireItemType.receiver ||
            previousType === IQuestionnaireItemType.receiverComponent
        ) {
            dispatchRemoveAttribute(IItemProperty.code);
        }
        if (previousType === IQuestionnaireItemType.inline) {
            props.dispatch(deleteChildItemsAction(props.item.linkId, props.parentArray));
        }
    }

    const addDefaultExtensionsAndAttributesForItemType = (type: string) => {
        if (type === IQuestionnaireItemType.attachment) {
            const extension = {
                url: IExtentionType.maxSize,
                valueDecimal: ATTACHMENT_DEFAULT_MAX_SIZE,
            };
            setItemExtension(props.item, extension, props.dispatch);
        }

        if (type === IQuestionnaireItemType.inline) {
            const extension = {
                url: IExtentionType.itemControl,
                valueCodeableConcept: {
                    coding: [{ system: IValueSetSystem.itemControlValueSet, code: ItemControlType.inline }],
                },
            };

            setItemExtension(props.item, extension, props.dispatch);
        }

        if (type === IQuestionnaireItemType.receiver) {
            setItemExtension(props.item, createDropdown, props.dispatch);
            dispatchUpdateItem(IItemProperty.code, [valueSetTqqcCoding]);
        }
    };

    const isSublabelSupported = (): boolean => {
        const isInlineItem = isItemControlInline(props.item);
        return (
            !isInlineItem &&
            props.item.type !== IQuestionnaireItemType.group &&
            props.item.type !== IQuestionnaireItemType.display &&
            props.item.type !== IQuestionnaireItemType.boolean
        );
    };

    const getHighlightExtensionValue = () => {
        const hasItemControl = props.item.extension?.find((x) => x.url === IExtentionType.itemControl);
        return hasItemControl?.valueCodeableConcept?.coding?.find((x) => x.code === ItemControlType.highlight);
    };

    const enableWhenCount =
        props.item.enableWhen && props.item.enableWhen.length > 0 ? `(${props.item.enableWhen?.length})` : '';

    // TODO: should it be possible to change linkId for recipient component?
    if (isItemControlReceiverComponent(props.item)) {
        return (
            <div className="question" id={props.item.linkId}>
                <div className="question-form">
                    <div className="form-field">
                        <label>{t('Select type')}</label>
                        <Select
                            value={handleDisplayQuestionType()}
                            options={itemType}
                            onChange={handleQuestionareTypeChange}
                        />
                        <div>{t('Recipient component is configured in Helsenorge admin')}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="question" id={props.item.linkId}>
            <div className="question-form">
                <FormField label={t('Select type')}>
                    <Select
                        value={handleDisplayQuestionType()}
                        options={itemType}
                        onChange={handleQuestionareTypeChange}
                    />
                </FormField>
                <div className="horizontal">
                    {props.item.type !== IQuestionnaireItemType.group &&
                        props.item.type !== IQuestionnaireItemType.display &&
                        !isItemControlInline(props.item) && (
                            <div className="form-field ">
                                <SwitchBtn
                                    label={t('Mandatory')}
                                    initial
                                    value={props.item.required || false}
                                    onChange={() => dispatchUpdateItem(IItemProperty.required, !props.item.required)}
                                />
                            </div>
                        )}
                    {(props.item.type === IQuestionnaireItemType.display || !!getHighlightExtensionValue()) && (
                        <div className="form-field ">
                            <SwitchBtn
                                label={t('Highlight')}
                                initial
                                value={!!getHighlightExtensionValue() || false}
                                onChange={() => {
                                    if (getHighlightExtensionValue()) {
                                        removeItemExtension(props.item, IExtentionType.itemControl, props.dispatch);
                                    } else {
                                        const extension = {
                                            url: IExtentionType.itemControl,
                                            valueCodeableConcept: {
                                                coding: [
                                                    {
                                                        system: IValueSetSystem.itemControlValueSet,
                                                        code: ItemControlType.highlight,
                                                    },
                                                ],
                                            },
                                        };
                                        setItemExtension(props.item, extension, props.dispatch);
                                    }
                                }}
                            />
                        </div>
                    )}
                    <FormField>
                        <SwitchBtn
                            label={t('Text formatting')}
                            initial
                            value={isMarkdownActivated}
                            onChange={() => {
                                const newIsMarkdownEnabled = !isMarkdownActivated;
                                setIsMarkdownActivated(newIsMarkdownEnabled);
                                if (!newIsMarkdownEnabled) {
                                    // remove markdown extension
                                    dispatchUpdateItem(IItemProperty._text, undefined);
                                } else {
                                    // set existing text as markdown value
                                    dispatchUpdateMarkdownLabel(props.item.text || '');
                                }
                            }}
                        />
                    </FormField>
                </div>
                <FormField label={t('Text')}>
                    {isMarkdownActivated ? (
                        <MarkdownEditor data={getLabelText()} onBlur={dispatchUpdateMarkdownLabel} />
                    ) : (
                        <textarea
                            defaultValue={getLabelText()}
                            onBlur={(e) => {
                                dispatchUpdateItem(IItemProperty.text, e.target.value);
                            }}
                        />
                    )}
                </FormField>
                {isSublabelSupported() && (
                    <FormField label={t('Sublabel')}>
                        <MarkdownEditor
                            data={getSublabelText()}
                            onBlur={(newValue: string) => {
                                if (newValue) {
                                    const newExtension = {
                                        url: IExtentionType.sublabel,
                                        valueMarkdown: newValue,
                                    };
                                    setItemExtension(props.item, newExtension, props.dispatch);
                                } else {
                                    removeItemExtension(props.item, IExtentionType.sublabel, props.dispatch);
                                }
                            }}
                        />
                    </FormField>
                )}
                {respondType(props.item.type)}
            </div>
            <div className="question-addons">
                {typeIsSupportingValidation(handleDisplayQuestionType() as IQuestionnaireItemType) && (
                    <Accordion title={t('Add validation')}>
                        <ValidationAnswerTypes item={props.item} />
                    </Accordion>
                )}
                <Accordion title={`${t('Enable when')} ${enableWhenCount}`}>
                    <div>
                        <EnableWhen
                            getItem={props.getItem}
                            conditionalArray={props.conditionalArray}
                            linkId={props.item.linkId}
                            enableWhen={props.item.enableWhen || []}
                            containedResources={props.containedResources}
                            itemValidationErrors={props.itemValidationErrors}
                        />
                    </div>
                </Accordion>
                {props.item.type !== IQuestionnaireItemType.display && (
                    <Accordion title={`${t('Code')} ${codeElements}`}>
                        <Codes linkId={props.item.linkId} itemValidationErrors={props.itemValidationErrors} />
                    </Accordion>
                )}
                <Accordion title={t('Advanced settings')}>
                    <AdvancedQuestionOptions item={props.item} parentArray={props.parentArray} />
                </Accordion>
            </div>
        </div>
    );
};

export default Question;
