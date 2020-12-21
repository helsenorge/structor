import React, { useContext } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import {
    newItemAction,
    deleteItemAction,
    updateItemAction,
    duplicateItemAction,
} from '../../store/treeStore/treeActions';
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../types/fhir';
import Trashcan from '../../images/icons/trash-outline.svg';
import PlusIcon from '../../images/icons/add-circle-outline.svg';
import CopyIcon from '../../images/icons/copy-outline.svg';
import itemType, { checkboxExtension, typeIsSupportingValidation } from '../../helpers/QuestionHelper';
import { IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
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

interface QuestionProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
    questionNumber: string;
    conditionalArray: {
        code: string;
        display: string;
    }[];
    getItem: (linkId: string) => QuestionnaireItem;
}

const Question = (props: QuestionProps): JSX.Element => {
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

    const dispatchUpdateItem = (name: IItemProperty, value: string | boolean | QuestionnaireItemAnswerOption[]) => {
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

    const respondType = (param: string) => {
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
                return (
                    <>
                        <div className="form-field">
                            <SwitchBtn
                                label="Checkbox"
                                onClick={() => dispatchExtentionUpdate()}
                                initial
                                value={props.item.extension !== undefined && props.item.extension.length > 0}
                            />
                            {props.item.answerOption?.map((answerOption, index) => (
                                <>
                                    <RadioBtn
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
                                </>
                            ))}
                        </div>
                        <Btn
                            title="+ Legg til alternativ"
                            onClick={() => {
                                const newArray = addEmptyOptionToAnswerOptionArray(
                                    props.item.answerOption || [],
                                    props.item.linkId,
                                );
                                dispatchUpdateItem(IItemProperty.answerOption, newArray);
                            }}
                        />
                    </>
                );
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
                            {props.item.answerOption?.map((answerOption, index) => (
                                <RadioBtn
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
                            ))}
                            <RadioBtn value="eget svaralternativ for bruker" />
                        </div>
                        <Btn
                            title="+ Legg til alternativ"
                            onClick={() => {
                                const newArray = addEmptyOptionToAnswerOptionArray(
                                    props.item.answerOption || [],
                                    props.item.linkId,
                                );
                                dispatchUpdateItem(IItemProperty.answerOption, newArray);
                            }}
                        />
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
                        value={props.item.type}
                        options={itemType}
                        onChange={(event: { target: { value: string | boolean } }) => {
                            dispatchUpdateItem(IItemProperty.type, event.target.value);
                            dispatchClearExtention();
                        }}
                    />
                </div>
                <div className="form-field">
                    <label>Skriv spørsmål</label>
                    <input
                        value={props.item.text}
                        onChange={(e) => {
                            dispatchUpdateItem(IItemProperty.text, e.target.value);
                        }}
                    />
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
