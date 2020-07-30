import React, { useContext } from 'react';
import { Checkbox, Input, Row, Col } from 'antd';
import './AnswerComponent.css';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { IText } from '../../types/IAnswer';
import { useTranslation } from 'react-i18next';

type TextInputProps = {
    questionId: string;
};

function TextInput({ questionId }: TextInputProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const localAnswer = state.questions[questionId].answer as IText;
    const { t } = useTranslation();

    function updateStore(attribute: { isLong?: boolean; maxLength?: string }) {
        const temp = { ...localAnswer } as IText;
        if (attribute.isLong !== undefined) temp.isLong = attribute.isLong;
        if (attribute.maxLength !== undefined)
            temp.maxLength = attribute.maxLength.length > 0 ? parseInt(attribute.maxLength) : undefined;
        dispatch(updateAnswer(questionId, temp));
    }

    return (
        <>
            <Row>
                <Col span={18}>
                    <Row>
                        <Col span={16}>
                            <Checkbox
                                checked={localAnswer.isLong}
                                onChange={(e) => {
                                    updateStore({
                                        isLong: e.target.checked,
                                    });
                                }}
                            >
                                {t('Max length')}
                            </Checkbox>
                        </Col>
                        <Col span={8}>
                            <Input
                                type="number"
                                width="100px"
                                disabled={!localAnswer.isLong}
                                defaultValue={localAnswer.maxLength}
                                min={0}
                                onBlur={(e) => {
                                    updateStore({
                                        maxLength: e.currentTarget.value,
                                    });
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
export default TextInput;
