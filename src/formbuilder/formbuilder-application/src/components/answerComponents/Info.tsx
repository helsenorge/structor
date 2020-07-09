import React, { useContext, useState } from 'react';
import './AnswerComponent.css';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { IInfo } from '../../types/IAnswer';
import TextArea from 'antd/lib/input/TextArea';

type TextInputProps = {
    questionId: string;
};

function TextInput({ questionId }: TextInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [localAnswer, setLocalAnswer] = useState(
        state.questions[questionId].answer as IInfo,
    );

    function localUpdate(attribute: {
        info?: string;
        hasInfo?: boolean;
        updateStore: boolean;
    }) {
        const temp = { ...localAnswer };
        if (attribute.hasInfo) {
            temp.info = attribute.info ? attribute.info : '';
            temp.hasInfo = true;
        }
        setLocalAnswer(temp);
        if (attribute.updateStore) dispatch(updateAnswer(questionId, temp));
    }

    return (
        <TextArea
            defaultValue={localAnswer.info}
            rows={8}
            className="input-question"
            placeholder={'Skriv inn informasjon til sluttbruker her.'}
            onBlur={() => localUpdate({ updateStore: true })}
            onChange={(value) =>
                localUpdate({
                    info: value.target.value,
                    hasInfo: true,
                    updateStore: false,
                })
            }
            style={{ width: '100%' }}
        ></TextArea>
    );
}
export default TextInput;
