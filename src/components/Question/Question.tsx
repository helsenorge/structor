import React, { useContext } from 'react';
import { TreeContext } from '../../store/treeStore/treeStore';
import { newItemAction, deleteItemAction, updateItemAction } from '../../store/treeStore/treeActions';
import { QuestionnaireItem } from '../../types/fhir';
import './Question.css';
import Trashcan from '../../images/icons/trash-outline.svg';
import PlusIcon from '../../images/icons/add-circle-outline.svg';

interface QuestionProps {
    item: QuestionnaireItem;
    parentArray: Array<string>;
}

const Question = (props: QuestionProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchNewItem = () => {
        dispatch(newItemAction('group', [...props.parentArray, props.item.linkId]));
    };

    const dispatchDeleteItem = () => {
        dispatch(deleteItemAction(props.item.linkId, props.parentArray));
    };

    const dispatchUpdateItem = (text: string) => {
        dispatch(updateItemAction(props.item.linkId, 'text', text));
    };

    const isRootLevel = props.parentArray.length === 0;

    return (
        <div className="question" style={{ marginLeft: props.parentArray.length * 32 }}>
            <div className="question-header">
                <span>{props.item.linkId}.</span>
                <button className="pull-right" onClick={dispatchDeleteItem}>
                    <img src={Trashcan} height="25" width="25" /> Slett
                </button>
                <button onClick={dispatchNewItem}>
                    <img src={PlusIcon} height="25" width="25" /> Legg til underspørsmål
                </button>
            </div>
            <div>
                <h2>Spørsmål</h2>
                <div className="form-field">
                    <label>Velg spørsmålstype</label>
                    <select>
                        <option value="valueString">Enkelvalg/radioknapper</option>
                        <option value="valueString">Flervalg/checkboxes</option>
                    </select>
                </div>
                <div className="form-field">
                    <label>Skriv spørsmål</label>
                    <input placeholder="Skriv inn et spørsmål.." onChange={(e) => dispatchUpdateItem(e.target.value)} />
                </div>
                <div className="form-field">
                    <label>Legg til beskrivelse (valgfritt)</label>
                    <input />
                </div>
            </div>
            <span>{`LinkId: ${props.item.linkId}, text: ${props.item.text}`}</span>
            {!isRootLevel && <span>{` med foreldre ${props.parentArray.join('->')}`}</span>}
        </div>
    );
};

export default Question;
