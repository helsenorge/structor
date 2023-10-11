import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { QuestionnaireItem, QuestionnaireItemAnswerOption } from '../../types/fhir';
import './AnswerOption.css';
import InputField from '../InputField/inputField';
import { doesItemHaveCode } from '../../utils/itemSearchUtils';
import { findExtensionInExtensionArray } from '../../helpers/extensionHelper';
import { IExtentionType } from '../../types/IQuestionnareItemType';

type Props = {
    item: QuestionnaireItem;
    answerOption?: QuestionnaireItemAnswerOption;
    handleDrag?: DraggableProvidedDragHandleProps;
    changeDisplay: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeCode: (event: React.ChangeEvent<HTMLInputElement>) => void;
    changeOrdinalValueExtension: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteItem?: () => void;
    showDelete?: boolean;
    disabled?: boolean;
};

const AnswerOption = ({
    item,
    answerOption,
    handleDrag,
    changeDisplay,
    changeCode,
    changeOrdinalValueExtension,
    deleteItem,
    showDelete,
    disabled,
}: Props): JSX.Element => {
    const { t } = useTranslation();

    const [displayScoringField, setDisplayScoringField] = useState(false);
    const inputFieldClassName = displayScoringField ? 'threeColumns' : 'twoColumns';

    const getDefaultScoreValue = (): string => {
        let stringToReturn = '';
        const scoreExtension =
            answerOption?.valueCoding?.extension &&
            findExtensionInExtensionArray(answerOption?.valueCoding?.extension, IExtentionType.ordinalValue);
        if (scoreExtension) {
            stringToReturn = scoreExtension?.valueDecimal?.toString() || '';
        }
        return stringToReturn;
    };

    useEffect(() => {
        setDisplayScoringField(doesItemHaveCode(item, 'score'));
    }, [item]);

    return (
        <div className="answer-option-item align-everything">
            {!disabled && <span {...handleDrag} className="reorder-icon" aria-label="reorder element" />}
            <div className="answer-option-content">
                <InputField
                    name="beskrivelse"
                    className={inputFieldClassName}
                    onBlur={(event) => changeDisplay(event)}
                    defaultValue={answerOption?.valueCoding?.display}
                    disabled={disabled}
                    placeholder={t('Enter a title..')}
                />
                <InputField
                    key={answerOption?.valueCoding?.code} // set key to update defaultValue when display field is blurred
                    name="verdi"
                    className={inputFieldClassName}
                    defaultValue={answerOption?.valueCoding?.code}
                    placeholder={t('Enter a value..')}
                    onBlur={(event) => changeCode(event)}
                />
                {displayScoringField && (
                    <InputField
                        name="skåring"
                        className={inputFieldClassName}
                        defaultValue={getDefaultScoreValue()}
                        placeholder={t('Enter a scoring value..')}
                        onChange={(event) => {
                            changeOrdinalValueExtension(event);
                        }}
                    />
                )}
            </div>
            {showDelete && (
                <button type="button" name={t('Remove element')} onClick={deleteItem} className="align-everything" />
            )}
        </div>
    );
};

export default AnswerOption;
