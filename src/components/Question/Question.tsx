import React, { useContext } from 'react';
import DatePicker from 'react-datepicker';
import { TreeContext } from '../../store/treeStore/treeStore';
import { newItemAction, deleteItemAction, updateItemAction } from '../../store/treeStore/treeActions';
import { QuestionnaireItem } from '../../types/fhir';
import Trashcan from '../../images/icons/trash-outline.svg';
import PlusIcon from '../../images/icons/add-circle-outline.svg';
import itemType from '../../helpers/QuestionHelper';
import { IItemProperty, IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import Picker from '../DatePicker/DatePicker';
import './Question.css';
import SwitchBtn from '../SwitchBtn/SwitchBtn';

interface QuestionProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
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

    return (
        <div className="question" style={{ marginLeft: props.parentArray.length * 32 }}>
            <div className="question-header">
                <span>{props.item.linkId}.</span>
                <button className="pull-right" onClick={dispatchDeleteItem}>
                    <img src={Trashcan} height="25" width="25" /> Slett
                </button>
                <button onClick={() => dispatchNewItem()}>
                    <img src={PlusIcon} height="25" width="25" /> Legg til underspørsmål
                </button>
            </div>
            <div className="question-form">
                <h2>Spørsmål</h2>
                <SwitchBtn
                    label="Obligatorisk"
                    value={props.item.required || false}
                    onClick={() => dispatchUpdateItem(IItemProperty.required, !props.item.required)}
                />
                <div className="form-field">
                    <label>Velg spørsmålstype</label>
                    <select
                        onChange={(event) => {
                            dispatchUpdateItem(IItemProperty.type, event.target.value);
                        }}
                    >
                        {itemType.map((item, index) => (
                            <option key={index} value={item.code}>
                                {item.display}
                            </option>
                        ))}
                    </select>
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
                {props.item.type === IQuestionnaireItemType.string && (
                    <div className="form-field">
                        <label></label>
                        <input disabled value="Kortsvar" />
                    </div>
                )}
                {props.item.type === IQuestionnaireItemType.text && (
                    <div className="form-field">
                        <label></label>
                        <input disabled value="Langsvar" />
                    </div>
                )}
                {props.item.type === IQuestionnaireItemType.date && (
                    <div className="form-field">
                        <label></label>
                        <Picker />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Question;
