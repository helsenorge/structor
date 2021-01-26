import React, { ChangeEvent, useContext } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import {
    deleteItemAction,
    duplicateItemAction,
    newItemAction,
    updateItemAction,
} from '../../store/treeStore/treeActions';
import {
    Element,
    Extension,
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    ValueSet,
    ValueSetComposeIncludeConcept,
} from '../../types/fhir';
import Trashcan from '../../images/icons/trash-outline.svg';
import PlusIcon from '../../images/icons/add-circle-outline.svg';
import CopyIcon from '../../images/icons/copy-outline.svg';
import itemType, {
    checkboxExtension,
    QUANTITY_UNIT_TYPE_NOT_SELECTED,
    quantityUnitTypes,
    typeIsSupportingValidation,
} from '../../helpers/QuestionHelper';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import Picker from '../DatePicker/DatePicker';
import './Question.css';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import Select from '../Select/Select';
import RadioBtn from '../RadioBtn/RadioBtn';
import Btn from '../Btn/Btn';
import Accordion from '../Accordion/Accordion';
import EnableWhen from '../EnableWhen/EnableWhen';

import ValidationAnswerTypes from './ValidationAnswerTypes/ValidationAnswerTypes';
import {
    addEmptyOptionToAnswerOptionArray,
    removeOptionFromAnswerOptionArray,
    updateAnswerOption,
} from '../../helpers/answerOptionHelper';
import { removeExtensionValue, setExtensionValue } from '../../helpers/extensionHelper';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';
import PredefinedValueSet from './QuestionType/PredefinedValueSet';
import Choice from './QuestionType/Choice';

interface QuestionProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
    questionNumber: string;
    conditionalArray: ValueSetComposeIncludeConcept[];
    getItem: (linkId: string) => QuestionnaireItem;
    containedResources?: Array<ValueSet>;
}

const Question = (props: QuestionProps): JSX.Element => {
    const [isMarkdownActivated, setIsMarkdownActivated] = React.useState<boolean>(!!props.item._text);
    const { dispatch } = useContext(TreeContext);

    const dispatchNewChildItem = (type?: IQuestionnaireItemType) => {
        dispatch(newItemAction(type || IQuestionnaireItemType.group, [...props.parentArray, props.item.linkId]));
    };

    const dispatchDeleteItem = () => {
        dispatch(deleteItemAction(props.item.linkId, props.parentArray));
    };

    const dispatchDuplicateItem = () => {
        dispatch(duplicateItemAction(props.item.linkId, props.parentArray));
    };

    const dispatchUpdateItem = (
        name: IItemProperty,
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | Extension[] | undefined,
    ) => {
        dispatch(updateItemAction(props.item.linkId, name, value));
    };

    const dispatchExtensionUpdate = () => {
        if (props.item.extension && props.item.extension.length > 0) {
            dispatch(updateItemAction(props.item.linkId, IItemProperty.extension, []));
        } else {
            dispatch(updateItemAction(props.item.linkId, IItemProperty.extension, checkboxExtension));
        }
    };

    const dispatchClearExtension = () => {
        dispatch(updateItemAction(props.item.linkId, IItemProperty.extension, []));
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
        const newValue = setExtensionValue(props.item._text, markdownValue);

        dispatchUpdateItem(IItemProperty._text, newValue);
        // update text with same value. Text is used in condition in enableWhen
        dispatchUpdateItem(IItemProperty.text, newLabel);
    };

    const getContainedValueSetValues = (valueSetId: string): Array<{ system?: string; display?: string }> => {
        const valueSet = props.containedResources?.find((x) => `#${x.id}` === valueSetId);
        if (valueSet && valueSet.compose && valueSet.compose.include && valueSet.compose.include[0].concept) {
            return valueSet.compose.include[0].concept.map((x) => {
                return { system: valueSet.compose?.include[0].system, display: x.display };
            });
        }
        return [];
    };

    const getQuantityUnitType = (): string => {
        const quantityUnitType = props.item.extension?.find((extension) => {
            return extension.url === IExtentionType.questionnaireUnit;
        })?.valueCoding?.code;

        return quantityUnitType || QUANTITY_UNIT_TYPE_NOT_SELECTED;
    };

    const updateQuantityUnitType = (event: ChangeEvent<HTMLSelectElement>) => {
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
            updatedExtensions = setExtensionValue(props.item, unitExtension).extension || [];
        }
        dispatchUpdateItem(IItemProperty.extension, updatedExtensions);
    };

    const renderValueSetValues = (): JSX.Element => {
        return (
            <>
                {props.item.answerValueSet && props.item.answerValueSet.startsWith('#') && (
                    <div>
                        <p>Dette spørsmålet bruker følgende innebygde verdier, som ikke kan endres i skjemabyggeren:</p>
                        {getContainedValueSetValues(props.item.answerValueSet).map((x, index) => {
                            return (
                                <RadioBtn name={x.system} key={index} disabled showDelete={false} value={x.display} />
                            );
                        })}
                    </div>
                )}
                {props.item.answerValueSet && props.item.answerValueSet.startsWith('http') && (
                    <div>{`Dette spørsmålet henter verdier fra ${props.item.answerValueSet}`}</div>
                )}
            </>
        );
    };

    const renderRadioBtn = (answerOption: QuestionnaireItemAnswerOption, index: number): JSX.Element => {
        return (
            <RadioBtn
                name={answerOption.valueCoding.system}
                key={index}
                showDelete={index > 1}
                value={answerOption.valueCoding.display}
                onChange={(event) => {
                    const newArray = updateAnswerOption(
                        props.item.answerOption || [],
                        answerOption.valueCoding.code || '',
                        event.target.value,
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
                deleteItem={() => {
                    const newArray = removeOptionFromAnswerOptionArray(
                        props.item.answerOption || [],
                        answerOption.valueCoding.code || '',
                    );
                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                }}
            />
        );
    };

    const respondType = (param: string) => {
        if (
            props.item.answerValueSet &&
            props.item.answerValueSet.indexOf('pre-') >= 0 &&
            param === IQuestionnaireItemType.choice
        ) {
            return <PredefinedValueSet linkId={props.item.linkId} selectedValueSet={props.item.answerValueSet} />;
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
                return (
                    <>
                        <div className="form-field">
                            <SwitchBtn
                                label="Checkbox"
                                onChange={() => dispatchExtensionUpdate()}
                                initial
                                value={props.item.extension !== undefined && props.item.extension.length > 0}
                            />
                            {props.item.answerValueSet && !props.item.answerOption && renderValueSetValues()}
                            {props.item.answerOption?.map((answerOption, index) => renderRadioBtn(answerOption, index))}
                            <RadioBtn value="eget svaralternativ for bruker" />
                        </div>
                        {!props.item.answerValueSet && (
                            <Btn
                                title="+ Legg til alternativ"
                                onClick={() => {
                                    const newArray = addEmptyOptionToAnswerOptionArray(props.item.answerOption || []);
                                    dispatchUpdateItem(IItemProperty.answerOption, newArray);
                                }}
                            />
                        )}
                    </>
                );
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
        return props.item.type;
    };
    const canCreateChild = props.item.type !== IQuestionnaireItemType.display;

    return (
        <div className="question" style={{ marginLeft: props.parentArray.length * 32 }}>
            <div className="question-header">
                <h2>
                    Spørsmål <span>{props.questionNumber}</span>
                </h2>
                <button className="pull-right question-button" onClick={dispatchDuplicateItem}>
                    <img src={CopyIcon} height="25" width="25" /> Dupliser
                </button>
                {canCreateChild && (
                    <button className="question-button" onClick={() => dispatchNewChildItem()}>
                        <img src={PlusIcon} height="25" width="25" /> Oppfølgingsspørsmål
                    </button>
                )}
                <button className="question-button" onClick={dispatchDeleteItem}>
                    <img src={Trashcan} height="25" width="25" /> Slett
                </button>
            </div>
            <div className="question-form">
                <SwitchBtn
                    label="Obligatorisk"
                    value={props.item.required || false}
                    onChange={() => dispatchUpdateItem(IItemProperty.required, !props.item.required)}
                />
                <div className="form-field">
                    <label>Velg spørsmålstype</label>
                    <Select
                        value={handleDisplayQuestionType()}
                        options={itemType}
                        onChange={(event: { target: { value: string | boolean } }) => {
                            if (event.target.value === IQuestionnaireItemType.predefined) {
                                dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.choice);
                                dispatchUpdateItem(IItemProperty.answerValueSet, 'pre-');
                            } else if (event.target.value === IQuestionnaireItemType.number) {
                                dispatchUpdateItem(IItemProperty.type, IQuestionnaireItemType.integer);
                                dispatchUpdateItem(IItemProperty.answerValueSet, '');
                            } else {
                                dispatchUpdateItem(IItemProperty.type, event.target.value);
                                dispatchUpdateItem(IItemProperty.answerValueSet, '');
                            }
                            dispatchClearExtension();
                        }}
                    />
                </div>
                <div className="form-field">
                    <div className="form-field-label-wrapper">
                        <label>Skriv spørsmål</label>
                        <SwitchBtn
                            label="Aktiver markdown"
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
                    {isMarkdownActivated ? (
                        <MarkdownEditor data={getLabelText()} onChange={dispatchUpdateMarkdownLabel} />
                    ) : (
                        <input
                            value={getLabelText()}
                            onChange={(e) => {
                                dispatchUpdateItem(IItemProperty.text, e.target.value);
                            }}
                        />
                    )}
                </div>
                {respondType(props.item.type)}
            </div>

            <div className="question-addons">
                {typeIsSupportingValidation(props.item.type as IQuestionnaireItemType) && (
                    <Accordion title="Legg til validering">
                        <ValidationAnswerTypes item={props.item} />
                    </Accordion>
                )}
                <Accordion
                    title={`Legg til betinget visning ${
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
            </div>
        </div>
    );
};

export default Question;
