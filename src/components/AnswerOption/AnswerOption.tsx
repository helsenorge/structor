import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { QuestionnaireItemAnswerOption } from '../../types/fhir';
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
            <span {...handleDrag} className="reorder-icon" aria-label="reorder element" />
            <input
                autoComplete="off"
                type="text"
                name="beskrivelse"
                onChange={onChange}
                value={answerOption.valueCoding?.display}
            />
            {showDelete && (
                <button type="button" name="Fjern element" onClick={deleteItem} className="align-everything" />
            )}
        </div>
    );
};

export default AnswerOption;
