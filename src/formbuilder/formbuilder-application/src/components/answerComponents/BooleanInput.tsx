import React, { useContext, useEffect } from 'react';
import { Checkbox } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import './AnswerComponent.css';
import { IBoolean } from '../../types/IAnswer';

type BooleanInputProps = {
    questionId: string;
};

function BooleanInput({ questionId }: BooleanInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = { ...(state.questions[questionId].answer as IBoolean) };

    function localUpdate(attribute: { isChecked?: boolean }) {
        const temp = { ...localAnswer } as IBoolean;
        if (attribute.isChecked !== undefined) temp.isChecked = attribute.isChecked;
        dispatch(updateAnswer(questionId, temp));
    }

    useEffect(() => {
        const temp = { ...state.questions[questionId].answer };
        temp.valid = true;
        dispatch(updateAnswer(questionId, temp));
    }, []);

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
                Skal være forhåndsvalgt.
            </Checkbox>
            <p style={{ fontStyle: 'italic', fontSize: 'small' }}>
                En samtykkekomponent vil dukke opp for brukeren som et avhukningsfelt. Brukeren må huke av dette feltet
                for å sende inn skjemaet.
            </p>
        </>
    );
}

export default BooleanInput;
