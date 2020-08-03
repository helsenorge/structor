import React, { useContext } from 'react';
import { Checkbox } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import './AnswerComponent.css';
import { IBoolean } from '../../types/IAnswer';
import { useTranslation } from 'react-i18next';

type BooleanInputProps = {
    questionId: string;
};

function BooleanInput({ questionId }: BooleanInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = { ...(state.questions[questionId].answer as IBoolean) };
    const { t } = useTranslation();

    function localUpdate(attribute: { isChecked?: boolean }) {
        const temp = { ...localAnswer } as IBoolean;
        if (attribute.isChecked !== undefined) temp.isChecked = attribute.isChecked;
        dispatch(updateAnswer(questionId, temp));
    }
    return (
        <>
            <Checkbox
                checked={localAnswer.isChecked}
                onChange={(e) =>
                    localUpdate({
                        isChecked: e.target.checked,
                    })
                }
            >
                {t('Checked by default')}
            </Checkbox>
            <p style={{ fontStyle: 'italic', fontSize: 'small' }}>
                {t('A checkbox will let the user confirm the text.')}
            </p>
        </>
    );
}

export default BooleanInput;
