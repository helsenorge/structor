import AnswerTypes from '../types/IAnswer';
import Choice from './answerComponents/Choice';
import BooleanInput from './answerComponents/BooleanInput';
import Time from './answerComponents/Time';
import Text from './answerComponents/Text';
import React, { useContext } from 'react';
import { FormContext } from '../store/FormStore';

type AnswerProps = {
    questionId: string;
};

type answerList = { [key: string]: JSX.Element };

function AnswerBuilder({ questionId }: AnswerProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);

    const answerBuilder: answerList = {
        // [AnswerTypes.choice]: <Choice questionId={questionId}></Choice>,
        // [AnswerTypes.boolean]: (
        //    <BooleanInput questionId={questionId}></BooleanInput>
        //),
        // [AnswerTypes.number]: <Number questionId={questionId}></Number>,
        [AnswerTypes.text]: <Text questionId={questionId}></Text>,
        // [AnswerTypes.time]: <Time questionId={questionId}></Time>,
    };

    return <Text questionId={questionId} />;
}

export default AnswerBuilder;
