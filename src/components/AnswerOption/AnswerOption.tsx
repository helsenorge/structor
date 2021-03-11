import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { QuestionnaireItemAnswerOption } from '../../types/fhir';

import ReorderIcon from '../../images/icons/reorder-three-outline.svg';
import CloseIcon from '../../images/icons/close-outline.svg';
import './AnswerOption.css';

type Props = {
    answerOption: QuestionnaireItemAnswerOption;
    handleDrag?: DraggableProvidedDragHandleProps;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteItem?: () => void;
    showDelete?: boolean;
};

const AnswerOption = ({ answerOption, handleDrag, onChange, deleteItem, showDelete }: Props): JSX.Element => {
    return (
        <div className="answer-option-item align-everything">
            <span {...handleDrag} className="anchor-icon">
                <img src={ReorderIcon} height={25} alt="reorder" aria-label="reorder item" />
            </span>
            <input
                autoComplete="off"
                type="text"
                name="beskrivelse"
                onChange={onChange}
                value={answerOption.valueCoding?.display}
            />
            {showDelete && (
                <button type="button" name="Fjern element" onClick={deleteItem} className="align-everything">
                    <img src={CloseIcon} height="25" width="25"></img>
                </button>
            )}
        </div>
    );
};

export default AnswerOption;
