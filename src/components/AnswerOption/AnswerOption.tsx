import React from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { QuestionnaireItemAnswerOption } from '../../types/fhir';
import './AnswerOption.css';

type Props = {
    answerOption?: QuestionnaireItemAnswerOption;
    handleDrag?: DraggableProvidedDragHandleProps;
    changeDisplay: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeCode: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteItem?: () => void;
    showDelete?: boolean;
    disabled?: boolean;
};

const AnswerOption = ({
    answerOption,
    handleDrag,
    changeDisplay,
    changeCode,
    deleteItem,
    showDelete,
    disabled,
}: Props): JSX.Element => {
    const { t } = useTranslation();
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
                    placeholder={t('Legg inn en tittel..')}
                />
                <input
                    autoComplete="off"
                    type="text"
                    name="verdi"
                    defaultValue={answerOption?.valueCoding?.code}
                    placeholder={t('Legg inn en verdi..')}
                    onBlur={(event) => changeCode(event)}
                />
            </div>
            {showDelete && (
                <button type="button" name={t('Fjern element')} onClick={deleteItem} className="align-everything" />
            )}
        </div>
    );
};

export default AnswerOption;
