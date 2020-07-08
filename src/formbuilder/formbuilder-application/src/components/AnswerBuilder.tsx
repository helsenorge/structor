import AnswerTypes from '../types/IAnswer';
import Choice from './answerComponents/Choice';
import BooleanInput from './answerComponents/BooleanInput';
import Time from './answerComponents/Time';
import Text from './answerComponents/Text';
import Number from './answerComponents/Number';
import Info from './answerComponents/Info';
import React, { useContext } from 'react';
import { FormContext } from '../store/FormStore';
import { Row, Col } from 'antd';

type AnswerProps = {
    questionId: string;
};

type answerList = { [key: string]: JSX.Element };

function AnswerBuilder({ questionId }: AnswerProps): JSX.Element {
    const { state } = useContext(FormContext);

    const answerBuilder: answerList = {
        [AnswerTypes.choice]: <Choice questionId={questionId} />,
        [AnswerTypes.boolean]: <BooleanInput questionId={questionId} />,
        [AnswerTypes.number]: <Number questionId={questionId} />,
        [AnswerTypes.text]: <Text questionId={questionId} />,
        [AnswerTypes.time]: <Time questionId={questionId} />,
        [AnswerTypes.info]: <Info questionId={questionId} />,
    };

    return (
        <Row className="standard">
            <Col span={20}>
                {answerBuilder[state.questions[questionId].answerType]}
            </Col>
        </Row>
    );
}

export default AnswerBuilder;
