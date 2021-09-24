import React from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { QuestionnaireItemAnswerOption } from '../../types/fhir';
import './AnswerOption.css';
import InputField from '../InputField/inputField';

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
                <InputField
                    name="beskrivelse"
                    onBlur={(event) => changeDisplay(event)}
                    defaultValue={answerOption?.valueCoding?.display}
                    disabled={disabled}
                    placeholder={t('Enter a title..')}
                />
                <InputField
                    key={answerOption?.valueCoding?.code} // set key to update defaultValue when display field is blurred
                    name="verdi"
                    defaultValue={answerOption?.valueCoding?.code}
                    placeholder={t('Enter a value..')}
                    onBlur={(event) => changeCode(event)}
                />
            </div>
            {showDelete && (
                <button type="button" name={t('Remove element')} onClick={deleteItem} className="align-everything" />
            )}
        </div>
    );
};

export default AnswerOption;
