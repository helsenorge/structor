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
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';

import { updateItemAction } from '../../store/treeStore/treeActions';
import { isRecipientList } from '../../helpers/QuestionHelper';
import { createMarkdownExtension, removeItemExtension, setItemExtension } from '../../helpers/extensionHelper';
import { isItemControlInline, isItemControlReceiverComponent, isItemControlHighlight } from '../../helpers/itemControl';

import Accordion from '../Accordion/Accordion';
import { ActionType } from '../../store/treeStore/treeStore';
import AdvancedQuestionOptions from '../AdvancedQuestionOptions/AdvancedQuestionOptions';
import Choice from './QuestionType/Choice';
import EnableWhen from '../EnableWhen/EnableWhen';
import Infotext from './QuestionType/Infotext';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';

import SwitchBtn from '../SwitchBtn/SwitchBtn';
import ValidationAnswerTypes from './ValidationAnswerTypes/ValidationAnswerTypes';
import Codes from '../AdvancedQuestionOptions/Code/Codes';
import OptionReference from './QuestionType/OptionReference';
import FormField from '../FormField/FormField';
import UnitTypeSelector from './UnitType/UnitTypeSelector';
import { DateType } from './QuestionType/DateType';
import { ValidationErrors } from '../../helpers/orphanValidation';
import {
    canTypeBeRequired,
    canTypeBeValidated,
    canTypeHaveSublabel,
    getItemDisplayType,
} from '../../helpers/questionTypeFeatures';
import { erRenderingOption } from '../../helpers/codeHelper';

interface QuestionProps {
    item: QuestionnaireItem;
    formExtensions: Array<Extension> | undefined;
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
    const codeElements = props.item.code
        ? `(${props.item.code.filter((value) => !erRenderingOption(value)).length})`
        : '(0)';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const removeMd = require('remove-markdown');

    const dispatchUpdateItem = (
        name: IItemProperty,
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | Extension[] | undefined,
    ): void => {
        props.dispatch(updateItemAction(props.item.linkId, name, value));
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

    const convertToPlaintext = (stringToBeConverted: string) => {
        let plainText = removeMd(stringToBeConverted);
        plainText = plainText.replaceAll('\\', '');
        plainText = plainText.replaceAll(/([ \n])+/g, ' ');
        return plainText;
    };

    const dispatchUpdateMarkdownLabel = (newLabel: string): void => {
        const markdownValue = createMarkdownExtension(newLabel);

        dispatchUpdateItem(IItemProperty._text, markdownValue);
        // update text with same value. Text is used in condition in enableWhen
        dispatchUpdateItem(IItemProperty.text, convertToPlaintext(newLabel));
    };

    const respondType = (): JSX.Element => {
        if (isItemControlReceiverComponent(props.item)) {
            return <div>{t('Recipient component is configured in Helsenorge admin')}</div>;
        }
        if (
            isItemControlInline(props.item) ||
            isItemControlHighlight(props.item) ||
            props.item.type === IQuestionnaireItemType.display
        ) {
            return <Infotext item={props.item} parentArray={props.parentArray} />;
        }
        if (isRecipientList(props.item)) {
            return <OptionReference item={props.item} />;
        }
        if (props.item.type === IQuestionnaireItemType.date || props.item.type === IQuestionnaireItemType.dateTime) {
            return <DateType item={props.item} dispatch={props.dispatch} />;
        }
        if (
            props.item.type === IQuestionnaireItemType.choice ||
            props.item.type === IQuestionnaireItemType.openChoice
        ) {
            return <Choice item={props.item} />;
        }
        if (props.item.type === IQuestionnaireItemType.quantity) {
            return <UnitTypeSelector item={props.item} />;
        }
        if (props.item.type === IQuestionnaireItemType.string || props.item.type === IQuestionnaireItemType.text) {
            return (
                <FormField>
                    <SwitchBtn
                        label={t('Multi-line textfield')}
                        value={props.item.type === IQuestionnaireItemType.text}
                        onChange={() => {
                            if (props.item.type === IQuestionnaireItemType.text) {
                                dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.string);
                            } else {
                                dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.text);
                            }
                        }}
                    />
                </FormField>
            );
        }
        return <></>;
    };

    const enableWhenCount =
        props.item.enableWhen && props.item.enableWhen.length > 0 ? `(${props.item.enableWhen?.length})` : '';

    return (
        <div className="question" id={props.item.linkId}>
            <div className="question-form">
                <h2 className="question-type-header">{t(getItemDisplayType(props.item))}</h2>
                <div className="horizontal">
                    <FormField>
                        <SwitchBtn
                            label={t('Text formatting')}
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
                    {canTypeBeRequired(props.item) && (
                        <FormField>
                            <SwitchBtn
                                label={t('Mandatory')}
                                value={props.item.required || false}
                                onChange={() => dispatchUpdateItem(IItemProperty.required, !props.item.required)}
                            />
                        </FormField>
                    )}
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
                {canTypeHaveSublabel(props.item) && (
                    <FormField label={t('Sublabel')} isOptional>
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
                {respondType()}
            </div>
            <div className="question-addons">
                {canTypeBeValidated(props.item) && (
                    <Accordion title={t('Add validation')}>
                        <ValidationAnswerTypes item={props.item} />
                    </Accordion>
                )}
                <Accordion title={`${t('Enable when')} ${enableWhenCount}`}>
                    <EnableWhen
                        getItem={props.getItem}
                        conditionalArray={props.conditionalArray}
                        linkId={props.item.linkId}
                        enableWhen={props.item.enableWhen || []}
                        containedResources={props.containedResources}
                        itemValidationErrors={props.itemValidationErrors}
                    />
                </Accordion>
                <Accordion title={`${t('Code')} ${codeElements}`}>
                    <Codes linkId={props.item.linkId} itemValidationErrors={props.itemValidationErrors} />
                </Accordion>
                <Accordion title={t('Advanced settings')}>
                    <AdvancedQuestionOptions
                        item={props.item}
                        parentArray={props.parentArray}
                        conditionalArray={props.conditionalArray}
                        getItem={props.getItem}
                    />
                </Accordion>
            </div>
        </div>
    );
};

export default Question;
