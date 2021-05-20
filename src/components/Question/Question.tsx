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
import React from 'react';
import {
    deleteChildItemsAction,
    newItemAction,
    removeItemAttributeAction,
    updateItemAction,
} from '../../store/treeStore/treeActions';
import itemType, {
    ATTACHMENT_DEFAULT_MAX_SIZE,
    typeIsSupportingValidation,
    valueSetTqqcCoding,
} from '../../helpers/QuestionHelper';
import { createDropdown, removeExtensionValue, updateExtensionValue } from '../../helpers/extensionHelper';
import {
    isItemControlDropDownAndOptionReference,
    isItemControlInline,
    ItemControlType,
} from '../../helpers/itemControl';

import Accordion from '../Accordion/Accordion';
import { ActionType } from '../../store/treeStore/treeStore';
import AdvancedQuestionOptions from '../AdvancedQuestionOptions/AdvancedQuestionOptions';
import Choice from './QuestionType/Choice';
import EnableWhen from '../EnableWhen/EnableWhen';
import Inline from './QuestionType/Inline';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import Picker from '../DatePicker/DatePicker';
import PredefinedValueSet from './QuestionType/PredefinedValueSet';
import Select from '../Select/Select';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import ValidationAnswerTypes from './ValidationAnswerTypes/ValidationAnswerTypes';
import Codes from '../AdvancedQuestionOptions/Code/Codes';
import OptionReference from './QuestionType/OptionReference';
import FormField from '../FormField/FormField';
import UnitTypeSelector from './UnitType/UnitTypeSelector';

interface QuestionProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
    containedResources?: Array<ValueSet>;
    conditionalArray: ValueSetComposeIncludeConcept[];
    getItem: (linkId: string) => QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
}

const Question = (props: QuestionProps): JSX.Element => {
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

    const dispatchClearExtension = (): void => {
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

    const dispatchUpdateMarkdownLabel = (newLabel: string): void => {
        const markdownValue = {
            url: IExtentionType.markdown,
            valueMarkdown: newLabel,
        };
        const newValue = { extension: updateExtensionValue(props.item._text, markdownValue) };

        dispatchUpdateItem(IItemProperty._text, newValue);
        // update text with same value. Text is used in condition in enableWhen
        dispatchUpdateItem(IItemProperty.text, newLabel);
    };

    const respondType = (param: string) => {
        if (props.item.answerValueSet && param === IQuestionnaireItemType.choice) {
            return <PredefinedValueSet linkId={props.item.linkId} selectedValueSet={props.item.answerValueSet} />;
        }
        if (isItemControlInline(props.item)) {
            return <Inline linkId={props.item.linkId} parentArray={props.parentArray} />;
        }

        if (isItemControlDropDownAndOptionReference(props.item)) {
            return <OptionReference item={props.item} />;
        }

        switch (param) {
            case IQuestionnaireItemType.string:
                return (
                    <div className="form-field">
                        <label></label>
                        <input disabled value="Kortsvar" />
                    </div>
                );
            case IQuestionnaireItemType.text:
                return (
                    <div className="form-field">
                        <label></label>
                        <input disabled value="Langsvar" />
                    </div>
                );
            case IQuestionnaireItemType.date:
                return (
                    <div className="form-field">
                        <label></label>
                        <Picker />
                    </div>
                );
            case IQuestionnaireItemType.time:
                return (
                    <div className="form-field">
                        <label></label>
                        <Picker type="time" />
                    </div>
                );
            case IQuestionnaireItemType.dateTime:
                return (
                    <div className="form-field">
                        <label></label>
                        <div className="horizontal">
                            <Picker type="time" />
                            <Picker type="date" />
                        </div>
                    </div>
                );
            case IQuestionnaireItemType.boolean:
                return (
                    <div className="form-field">
                        <input type="checkbox" style={{ zoom: 1.5 }} disabled checked />
                    </div>
                );
            case IQuestionnaireItemType.choice:
                return <Choice item={props.item} />;
            case IQuestionnaireItemType.openChoice:
                return <Choice item={props.item} />;
            case IQuestionnaireItemType.quantity:
                return <UnitTypeSelector item={props.item} dispatchUpdateItem={dispatchUpdateItem} />;
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

        if (isItemControlDropDownAndOptionReference(props.item)) {
            return IQuestionnaireItemType.address;
        }
        if (isItemControlInline(props.item)) {
            return IQuestionnaireItemType.inline;
        }
        return props.item.type;
    };

    const handleQuestionareTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const previousType = handleDisplayQuestionType();
        const newType = event.target.value;

        dispatchClearExtension();
        addDefaultExtensionsAndAttributesForItemType(newType);
        cleanupChildItems(previousType);

        if (newType === IQuestionnaireItemType.predefined) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.choice);
            dispatchUpdateItem(IItemProperty.answerValueSet, '#');
            dispatchRemoveAttribute(IItemProperty.answerOption);
        } else if (newType === IQuestionnaireItemType.number) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.integer);
            dispatchRemoveAttribute(IItemProperty.answerValueSet);
        } else if (newType === IQuestionnaireItemType.address) {
            dispatchRemoveAttribute(IItemProperty.answerValueSet);
            dispatchRemoveAttribute(IItemProperty.answerOption);
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.choice);
        } else if (newType === IQuestionnaireItemType.inline) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.text);
            dispatchNewChildItem(IQuestionnaireItemType.display);
        } else {
            dispatchUpdateItem(IItemProperty.type, newType);
            dispatchRemoveAttribute(IItemProperty.answerValueSet);
        }
    };

    function cleanupChildItems(previousType: string) {
        if (previousType === IQuestionnaireItemType.address) {
            dispatchRemoveAttribute(IItemProperty.code);
        }
        if (previousType === IQuestionnaireItemType.inline) {
            props.dispatch(deleteChildItemsAction(props.item.linkId, props.parentArray));
        }
    }

    const addDefaultExtensionsAndAttributesForItemType = (type: string) => {
        if (type === IQuestionnaireItemType.attachment) {
            dispatchUpdateItem(IItemProperty.extension, [
                {
                    url: IExtentionType.maxSize,
                    valueDecimal: ATTACHMENT_DEFAULT_MAX_SIZE,
                },
            ]);
        }

        if (type === IQuestionnaireItemType.inline) {
            dispatchUpdateItem(IItemProperty.extension, [
                {
                    url: IExtentionType.itemControl,
                    valueCodeableConcept: {
                        coding: [{ system: IExtentionType.itemControlValueSet, code: ItemControlType.inline }],
                    },
                },
            ]);
        }

        if (type === IQuestionnaireItemType.address) {
            dispatchUpdateItem(IItemProperty.extension, [createDropdown]);
            dispatchUpdateItem(IItemProperty.code, [valueSetTqqcCoding]);
        }
    };

    const enableWhenCount =
        props.item.enableWhen && props.item.enableWhen.length > 0 ? `(${props.item.enableWhen?.length})` : '';

    return (
        <div className="question" id={props.item.linkId}>
            <div className="question-form">
                <div className="form-field">
                    <label>Velg type</label>
                    <Select
                        value={handleDisplayQuestionType()}
                        options={itemType}
                        onChange={handleQuestionareTypeChange}
                    />
                </div>
                <div className="horizontal">
                    {props.item.type !== IQuestionnaireItemType.group &&
                        props.item.type !== IQuestionnaireItemType.display && (
                            <div className="form-field ">
                                <SwitchBtn
                                    label="Obligatorisk"
                                    initial
                                    value={props.item.required || false}
                                    onChange={() => dispatchUpdateItem(IItemProperty.required, !props.item.required)}
                                />
                            </div>
                        )}
                    <div className="form-field">
                        <SwitchBtn
                            label="Tekstformatering"
                            initial
                            value={isMarkdownActivated}
                            onChange={() => {
                                const newIsMarkdownEnabled = !isMarkdownActivated;
                                setIsMarkdownActivated(newIsMarkdownEnabled);
                                if (!newIsMarkdownEnabled) {
                                    // remove markdown extension, but keep other extensions
                                    const newValue = removeExtensionValue(props.item._text, IExtentionType.markdown);
                                    dispatchUpdateItem(IItemProperty._text, newValue);
                                } else {
                                    // set existing text as markdown value
                                    dispatchUpdateMarkdownLabel(props.item.text || '');
                                }
                            }}
                        />
                    </div>
                </div>
                <FormField label="Tekst">
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
                {respondType(props.item.type)}
            </div>
            <div className="question-addons">
                {typeIsSupportingValidation(handleDisplayQuestionType() as IQuestionnaireItemType) && (
                    <Accordion title="Legg til validering">
                        <ValidationAnswerTypes item={props.item} />
                    </Accordion>
                )}
                <Accordion title={`Betinget visning ${enableWhenCount}`}>
                    <div>
                        <EnableWhen
                            getItem={props.getItem}
                            conditionalArray={props.conditionalArray}
                            linkId={props.item.linkId}
                            enableWhen={props.item.enableWhen || []}
                            containedResources={props.containedResources}
                        />
                    </div>
                </Accordion>
                {props.item.type !== IQuestionnaireItemType.display && (
                    <Accordion title={`Code ${codeElements}`}>
                        <Codes linkId={props.item.linkId} />
                    </Accordion>
                )}
                <Accordion title="Avanserte innstillinger">
                    <AdvancedQuestionOptions item={props.item} parentArray={props.parentArray} />
                </Accordion>
            </div>
        </div>
    );
};

export default React.memo(Question, (prevProps: QuestionProps, nextProps: QuestionProps) => {
    // if ALL of these props are identical, do not re-render the question
    const isItemIdentical = JSON.stringify(prevProps.item) === JSON.stringify(nextProps.item);
    const isParentArrayIdentical = JSON.stringify(prevProps.parentArray) === JSON.stringify(nextProps.parentArray);
    const isConditionalArrayIdentical =
        JSON.stringify(prevProps.conditionalArray) === JSON.stringify(nextProps.conditionalArray);
    const isContainedResourcesIdentical =
        JSON.stringify(prevProps.containedResources) === JSON.stringify(nextProps.containedResources);
    return isItemIdentical && isParentArrayIdentical && isConditionalArrayIdentical && isContainedResourcesIdentical;
});
