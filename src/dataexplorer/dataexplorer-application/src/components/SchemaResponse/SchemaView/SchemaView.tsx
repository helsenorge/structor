import React, { useState, useEffect } from 'react';
import { IQA, IAnswer, IQuestion } from 'types/IQuestionnaireResponse';
import Title from 'antd/lib/typography/Title';

interface ISchemaViewProps {
    questions: IQuestion[];
    answers: IAnswer[];
}

const SchemaView = (props: ISchemaViewProps) => {
    const [qAndA, setQAndA] = useState<IQA[]>([]);
    useEffect(() => {
        let hasAddedId = false;
        props.questions.map((q) => {
            props.answers.map((a) => {
                if (q.id === a.id) {
                    hasAddedId = true;
                    setQAndA((qAndA) => [
                        ...qAndA,
                        { id: q.id, questions: q, answers: a },
                    ]);
                }
            });
            hasAddedId === false &&
                setQAndA((qAndA) => [...qAndA, { id: q.id, questions: q }]);
            hasAddedId = false;
        });
    }, [props]);
    qAndA.length > 0 ? console.log(qAndA) : console.log('alltid tom');
    return (
        <>
            {qAndA.length > 0 &&
                qAndA.map((i) => (
                    <div key={i.id}>
                        {i.id.match('^[^.]*$') ? (
                            <Title level={2}>
                                {i.questions.questions.text}
                            </Title>
                        ) : (
                            <Title level={3}>
                                {i.questions.questions.text}
                            </Title>
                        )}
                        <p>
                            {i.answers?.answers.answer?.map(
                                (a) => a.valueString,
                            )}
                            {i.answers?.answers.answer?.map(
                                (a) => a.valueCoding?.code,
                            )}
                            {i.answers?.answers.answer?.map(
                                (a) => a.valueCoding?.display,
                            )}
                            {i.answers?.answers.answer?.map((a) => a.valueDate)}
                            {i.answers?.answers.answer?.map(
                                (a) => a.valueBoolean,
                            )}
                            {i.answers?.answers.answer?.map(
                                (a) => a.valueDecimal,
                            )}
                        </p>
                    </div>
                ))}
        </>
    );
};

export default SchemaView;
