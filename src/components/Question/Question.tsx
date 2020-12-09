import React, { useContext } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import {
    newItemAction,
    deleteItemAction,
    updateItemAction,
    newValueSetCodeAction,
    updateValueSetCodeAction,
} from '../../store/treeStore/treeActions';
import { QuestionnaireItem, ValueSetComposeIncludeConcept } from '../../types/fhir';
import Trashcan from '../../images/icons/trash-outline.svg';
import PlusIcon from '../../images/icons/add-circle-outline.svg';
import itemType from '../../helpers/QuestionHelper';
import { IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import Picker from '../DatePicker/DatePicker';
import './Question.css';
import SwitchBtn from '../SwitchBtn/SwitchBtn';
import Select from '../Select/Select';
import RadioBtn from '../RadioBtn/RadioBtn';
import Btn from '../Btn/Btn';
import Accordion from '../Accordion/Accordion';

interface QuestionProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
    valueSet: ValueSetComposeIncludeConcept[] | null;
}

const Question = (props: QuestionProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    // const [name, setName] = useState('');

    const dispatchNewItem = (type?: IQuestionnaireItemType) => {
        dispatch(newItemAction(type || IQuestionnaireItemType.group, [...props.parentArray, props.item.linkId]));
    };

    const dispatchDeleteItem = () => {
        dispatch(deleteItemAction(props.item.linkId, props.parentArray));
    };

    const dispatchUpdateItem = (name: IItemProperty, value: string | boolean) => {
        dispatch(updateItemAction(props.item.linkId, name, value));
    };

    const dispatchNewValueSetQuestion = (question: string) => {
        dispatch(newValueSetCodeAction(props.item.linkId, question));
    };

    const dispatchUpdateValueSet = (valueSet: ValueSetComposeIncludeConcept) => {
        dispatch(updateValueSetCodeAction(props.item.linkId, valueSet));
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
                        <label>Todo</label>
                    </div>
                );
            case IQuestionnaireItemType.choice:
                return (
                    <>
                        <div className="form-field">
                            {props.valueSet &&
                                props.valueSet.map((set, index) => (
                                    <RadioBtn
                                        key={index}
                                        valueSetID={props.item.linkId + '-valueSet'}
                                        value={set.display}
                                        onChange={(event) => {
                                            const clone = { ...set, display: event.target.value };
                                            dispatchUpdateValueSet(clone);
                                        }}
                                        deletable={index > 1}
                                    />
                                ))}
                        </div>
                        <Btn title="+ Legg til alternativ" onClick={() => dispatchNewValueSetQuestion('')} />
                    </>
                );
            default:
                return '';
        }
    };

    return (
        <div className="question" style={{ marginLeft: props.parentArray.length * 32 }}>
            <div className="question-header">
                <h2>Spørsmål</h2>
                <button className="pull-right" onClick={dispatchDeleteItem}>
                    <img src={Trashcan} height="25" width="25" /> Slett
                </button>
                <button onClick={() => dispatchNewItem()}>
                    <img src={PlusIcon} height="25" width="25" /> Legg til underspørsmål
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
                {/*<div className="form-field">
                    <label>Legg til beskrivelse (valgfritt)</label>
                    <input onChange={(e) => {
                        dispatchUpdateItem(IItemProperty.des, e.target.value);
                    }}
                    />
                </div>*/}
                {respondType(props.item.type)}
            </div>
            <div className="question-addons">
                <Accordion title="Legg til validering" />
            </div>
        </div>
    );
};

export default Question;
