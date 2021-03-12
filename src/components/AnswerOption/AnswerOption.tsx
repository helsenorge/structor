import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { QuestionnaireItemAnswerOption } from '../../types/fhir';
import './AnswerOption.css';

type Props = {
    answerOption?: QuestionnaireItemAnswerOption;
    handleDrag?: DraggableProvidedDragHandleProps;
    changeDisplay: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeCode: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    deleteItem?: () => void;
    showDelete?: boolean;
    disabled?: boolean;
    index: number;
};

const AnswerOption = ({
    answerOption,
    handleDrag,
    changeDisplay,
    changeCode,
    deleteItem,
    showDelete,
    disabled,
    index,
}: Props): JSX.Element => {
    return (
        <div className="answer-option-item align-everything">
            {!disabled && <span {...handleDrag} className="reorder-icon" aria-label="reorder element" />}
            <div className="answer-option-content">
                <input
                    autoComplete="off"
                    type="text"
                    name="beskrivelse"
                    onBlur={(event) => changeDisplay(event)}
                    defaultValue={answerOption?.valueCoding?.display}
                    disabled={disabled}
                    placeholder="Legg inn tittel"
                />
                <input
                    autoComplete="off"
                    type="text"
                    name="verdi"
                    defaultValue={answerOption?.valueCoding?.code}
                    placeholder="Legg inn verdi.."
                    onBlur={(event) => changeCode(event, index)}
                />
            </div>
            {showDelete && (
                <button type="button" name="Fjern element" onClick={deleteItem} className="align-everything" />
            )}
        </div>
    );
};

export default AnswerOption;
