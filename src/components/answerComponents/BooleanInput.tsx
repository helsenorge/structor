import React, { useContext } from 'react';
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
                En avkrysningskomponent vil dukke opp for brukeren. Denne kan brukes til f.eks samtykke.
            </p>
        </>
    );
}

export default BooleanInput;
