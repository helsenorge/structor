import React, { useContext } from 'react';
import './AnswerComponent.css';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { IInfo } from '../../types/IAnswer';
import TextArea from 'antd/lib/input/TextArea';
import { useTranslation } from 'react-i18next';

type TextInputProps = {
    questionId: string;
};

function TextInput({ questionId }: TextInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = { ...(state.questions[questionId].answer as IInfo) };
    const { t } = useTranslation();

    function localUpdate(attribute: { info?: string; hasInfo?: boolean }) {
        const temp = { ...localAnswer };
        if (attribute.hasInfo) {
            temp.info = attribute.info ? attribute.info : '';
            temp.hasInfo = true;
        }
        dispatch(updateAnswer(questionId, temp));
    }

    return (
        <TextArea
            defaultValue={localAnswer.info}
            rows={8}
            className="input-question"
            placeholder={t('Add info to respondent here.')}
            onBlur={(value) =>
                localUpdate({
                    info: value.target.value,
                    hasInfo: true,
                })
            }
        ></TextArea>
    );
}
export default TextInput;
