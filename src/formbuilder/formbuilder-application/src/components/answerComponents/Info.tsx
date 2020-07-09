import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import './AnswerComponent.css';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { IInfo } from '../../types/IAnswer';
import TextArea from 'antd/lib/input/TextArea';

type TextInputProps = {
    questionId: string;
};

function TextInput({ questionId }: TextInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);

    function localUpdate(attribute: { info?: string; hasInfo?: boolean }) {
        const temp = { ...(state.questions[questionId].answer as IInfo) };
        if (attribute.hasInfo) {
            temp.info = attribute.info ? attribute.info : '';
            temp.hasInfo = true;
        }
        dispatch(updateAnswer(questionId, temp));
    }

    return (
        <Row className="standard">
            <Col span={20}>
                <TextArea
                    defaultValue={
                        (state.questions[questionId].answer as IInfo).info
                    }
                    rows={3}
                    className="input-question"
                    placeholder={'Skriv inn informasjon til sluttbruker her.'}
                    onBlur={(value) =>
                        localUpdate({
                            info: value.target.value,
                            hasInfo: true,
                        })
                    }
                ></TextArea>
            </Col>
        </Row>
    );
}
export default TextInput;
