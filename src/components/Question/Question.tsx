import React, { useContext } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import {
    newItemAction,
    deleteItemAction,
    updateItemAction,
    duplicateItemAction,
} from '../../store/treeStore/treeActions';
import { QuestionnaireItem, QuestionnaireItemAnswerOption, Element, ValueSet } from '../../types/fhir';
import Trashcan from '../../images/icons/trash-outline.svg';
import PlusIcon from '../../images/icons/add-circle-outline.svg';
import CopyIcon from '../../images/icons/copy-outline.svg';
import itemType, { checkboxExtension, typeIsSupportingValidation } from '../../helpers/QuestionHelper';
import { IItemProperty, IQuestionnaireItemType, IExtentionType } from '../../types/IQuestionnareItemType';
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
    conditionalArray: {
        code: string;
        display: string;
    }[];
    getItem: (linkId: string) => QuestionnaireItem;
    containedResources?: Array<ValueSet>;
}

const Question = (props: QuestionProps): JSX.Element => {
    const [isMarkdownActivated, setIsMarkdownActivated] = React.useState<boolean>(!!props.item._text);
    const { dispatch } = useContext(TreeContext);

    const dispatchNewItem = (type?: IQuestionnaireItemType) => {
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
        value: string | boolean | QuestionnaireItemAnswerOption[] | Element | undefined,
    ) => {
        dispatch(updateItemAction(props.item.linkId, name, value));
    };

    const dispatchExtentionUpdate = () => {
        if (props.item.extension && props.item.extension.length > 0) {
            dispatch(updateItemAction(props.item.linkId, IItemProperty.extension, []));
        } else {
            dispatch(updateItemAction(props.item.linkId, IItemProperty.extension, checkboxExtension));
        }
    };

    const dispatchClearExtention = () => {
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
                                onClick={() => dispatchExtentionUpdate()}
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
            case IQuestionnaireItemType.integer:
                return (
                    <>
                        <div className="form-field">
                            <Select
                                options={[
                                    { display: 'ingen formatering', code: '1' },
                                    { display: 'kg', code: '2' },
                                    { display: 'år', code: '3' },
                                    { display: 'måneder', code: '4' },
                                    { display: 'dager', code: '5' },
                                ]}
                                onChange={() => {
                                    //TODO!
                                }}
                            />
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
        return props.item.type;
    };

    return (
        <div className="question" style={{ marginLeft: props.parentArray.length * 32 }}>
            <div className="question-header">
                <h2>
                    Spørsmål <span>{props.questionNumber}</span>
                </h2>
                <button className="pull-right" onClick={dispatchDuplicateItem}>
                    <img src={CopyIcon} height="25" width="25" /> Dupliser
                </button>
                <button onClick={() => dispatchNewItem()}>
                    <img src={PlusIcon} height="25" width="25" /> Oppfølgingsspørsmål
                </button>
                <button onClick={dispatchDeleteItem}>
                    <img src={Trashcan} height="25" width="25" /> Slett
                </button>
            </div>
            <div className="question-form">
                <SwitchBtn
                    label="Obligatorisk"
                    value={props.item.required || false}
                    onClick={() => dispatchUpdateItem(IItemProperty.required, !props.item.required)}
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
                            } else {
                                dispatchUpdateItem(IItemProperty.type, event.target.value);
                                dispatchUpdateItem(IItemProperty.answerValueSet, '');
                            }
                            dispatchClearExtention();
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
                            onClick={() => {
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
                {props.parentArray.length > 0 && (
                    <Accordion title="Legg til betinget visning">
                        <div style={{ width: '66%', minHeight: '442px' }}>
                            <EnableWhen
                                getItem={props.getItem}
                                conditionalArray={props.conditionalArray}
                                linkId={props.item.linkId}
                                enableWhen={props.item.enableWhen || []}
                            />
                        </div>
                    </Accordion>
                )}
            </div>
        </div>
    );
};

export default Question;
