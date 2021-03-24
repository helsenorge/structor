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
import React, { ChangeEvent, useEffect } from 'react';
import {
    deleteChildItemsAction,
    deleteItemAction,
    duplicateItemAction,
    newItemAction,
    removeItemAttributeAction,
    updateItemAction,
    updateMarkedLinkIdAction,
} from '../../store/treeStore/treeActions';
import itemType, {
    ATTACHMENT_DEFAULT_MAX_SIZE,
    QUANTITY_UNIT_TYPE_NOT_SELECTED,
    quantityUnitTypes,
    typeIsSupportingValidation,
} from '../../helpers/QuestionHelper';
import { removeExtensionValue, updateExtensionValue } from '../../helpers/extensionHelper';
import { isItemControlInline } from '../../helpers/itemControl';

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
import FormField from '../FormField/FormField';

interface QuestionProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
    questionNumber: string;
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

    const dispatchDeleteItem = (): void => {
        props.dispatch(deleteItemAction(props.item.linkId, props.parentArray));
    };

    const dispatchDuplicateItem = (): void => {
        props.dispatch(duplicateItemAction(props.item.linkId, props.parentArray));
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

    const getQuantityUnitType = (): string => {
        const quantityUnitType = props.item.extension?.find((extension) => {
            return extension.url === IExtentionType.questionnaireUnit;
        })?.valueCoding?.code;

        return quantityUnitType || QUANTITY_UNIT_TYPE_NOT_SELECTED;
    };

    const updateQuantityUnitType = (event: ChangeEvent<HTMLSelectElement>): void => {
        const {
            target: { value: quantityUnitTypeCode },
        } = event;
        let updatedExtensions: Extension[];
        if (quantityUnitTypeCode === QUANTITY_UNIT_TYPE_NOT_SELECTED) {
            updatedExtensions = removeExtensionValue(props.item, IExtentionType.questionnaireUnit)?.extension || [];
        } else {
            const coding = quantityUnitTypes.find(({ code }) => code === quantityUnitTypeCode);
            const unitExtension: Extension = {
                url: IExtentionType.questionnaireUnit,
                valueCoding: coding,
            };
            updatedExtensions = updateExtensionValue(props.item, unitExtension);
        }
        dispatchUpdateItem(IItemProperty.extension, updatedExtensions);
    };

    const respondType = (param: string) => {
        if (
            props.item.answerValueSet &&
            props.item.answerValueSet.indexOf('pre-') >= 0 &&
            param === IQuestionnaireItemType.choice
        ) {
            return <PredefinedValueSet linkId={props.item.linkId} selectedValueSet={props.item.answerValueSet} />;
        }
        if (isItemControlInline(props.item)) {
            return <Inline linkId={props.item.linkId} parentArray={props.parentArray} />;
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
                return (
                    <>
                        <div className="form-field">
                            <div>
                                <label>Legg til enhet</label>
                                <Select
                                    options={quantityUnitTypes}
                                    onChange={updateQuantityUnitType}
                                    value={getQuantityUnitType()}
                                />
                            </div>
                        </div>
                    </>
                );
            default:
                return '';
        }
    };

    const handleDisplayQuestionType = () => {
        if (props.item.answerValueSet && props.item.answerValueSet.indexOf('pre-') >= 0) {
            return IQuestionnaireItemType.predefined;
        }
        if (props.item.type === IQuestionnaireItemType.integer || props.item.type === IQuestionnaireItemType.decimal) {
            return IQuestionnaireItemType.number;
        }
        if (isItemControlInline(props.item)) {
            return IQuestionnaireItemType.inline;
        }
        return props.item.type;
    };

    const handleQuestionareTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const previousType = handleDisplayQuestionType();
        const newType = event.target.value;
        if (newType === IQuestionnaireItemType.predefined) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.choice);
            dispatchUpdateItem(IItemProperty.answerValueSet, 'pre-');
            dispatchRemoveAttribute(IItemProperty.answerOption);
        } else if (newType === IQuestionnaireItemType.number) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.integer);
            dispatchRemoveAttribute(IItemProperty.answerValueSet);
        } else if (newType === IQuestionnaireItemType.inline) {
            dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.text);
            dispatchNewChildItem(IQuestionnaireItemType.display);
        } else {
            dispatchUpdateItem(IItemProperty.type, newType);
            dispatchRemoveAttribute(IItemProperty.answerValueSet);
        }
        dispatchClearExtension();
        addDefaultExtensionsForItemType(newType);
        cleanupChildItems(previousType);
    };

    function cleanupChildItems(previousType: string) {
        if (previousType === IQuestionnaireItemType.inline) {
            props.dispatch(deleteChildItemsAction(props.item.linkId, props.parentArray));
        }
    }

    const addDefaultExtensionsForItemType = (type: string) => {
        if (type === IQuestionnaireItemType.attachment) {
            dispatchUpdateItem(
                IItemProperty.extension,
                updateExtensionValue(props.item, {
                    url: IExtentionType.maxSize,
                    valueDecimal: ATTACHMENT_DEFAULT_MAX_SIZE,
                }),
            );
        }
        if (type === IQuestionnaireItemType.inline) {
            dispatchUpdateItem(
                IItemProperty.extension,
                updateExtensionValue(props.item, {
                    url: IExtentionType.itemControl,
                    valueCodeableConcept: {
                        coding: [{ system: IExtentionType.itemControlValueSet, code: 'inline' }],
                    },
                }),
            );
        }
    };

    const canCreateChild = props.item.type !== IQuestionnaireItemType.display && !isItemControlInline(props.item);

    const observed = (elements: IntersectionObserverEntry[]) => {
        if (elements[0].intersectionRatio > 0.5) {
            props.dispatch(updateMarkedLinkIdAction(props.item.linkId));
        }
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '52px 0px 0px 0px',
            threshold: [0.5],
        };

        const myObserver = new IntersectionObserver(observed, options);

        const myEl = document.getElementById(props.item.linkId);

        if (myEl) {
            myObserver.observe(myEl);
        }
    }, []);

    return (
        <div className="question" style={{ marginLeft: props.parentArray.length * 32 }} id={props.item.linkId}>
            <div className="question-header">
                <h2>
                    Element <span>{props.questionNumber}</span>
                </h2>
                <button className="pull-right question-button" onClick={dispatchDuplicateItem}>
                    <i className="duplicate-icon" aria-label="duplicate element" /> Dupliser
                </button>
                {canCreateChild && (
                    <button className="question-button" onClick={() => dispatchNewChildItem()}>
                        <i className="add-icon" aria-label="add child element" /> Oppfølgingsspørsmål
                    </button>
                )}
                <button className="question-button" onClick={dispatchDeleteItem}>
                    <i className="trash-icon" aria-label="remove element" /> Slett
                </button>
            </div>
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
                    <div className="form-field ">
                        <SwitchBtn
                            label="Obligatorisk"
                            initial
                            value={props.item.required || false}
                            onChange={() => dispatchUpdateItem(IItemProperty.required, !props.item.required)}
                        />
                    </div>
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
                <Accordion
                    title={`Betinget visning ${
                        props.item.enableWhen && props.item.enableWhen.length > 0
                            ? `(${props.item.enableWhen?.length})`
                            : ''
                    }`}
                >
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
    const isQuestionNumberIdentical = prevProps.questionNumber === nextProps.questionNumber;
    const isContainedResourcesIdentical =
        JSON.stringify(prevProps.containedResources) === JSON.stringify(nextProps.containedResources);
    return (
        isItemIdentical &&
        isParentArrayIdentical &&
        isConditionalArrayIdentical &&
        isQuestionNumberIdentical &&
        isContainedResourcesIdentical
    );
});
