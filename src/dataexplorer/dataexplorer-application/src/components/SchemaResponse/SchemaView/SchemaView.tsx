import React, { useState, useEffect } from 'react';
import {
    IQuestionAndAnswer,
    IAnswer,
    IQuestion,
} from 'types/IQuestionAndAnswer';
import Title from 'antd/lib/typography/Title';
import { ResourceContainer } from 'types/fhirTypes/fhir';

interface ISchemaViewProps {
    questions: IQuestion[];
    answers: IAnswer[];
    questionnaireResource: ResourceContainer[];
}

const SchemaView = (props: ISchemaViewProps) => {
    const [qAndA, setQAndA] = useState<IQuestionAndAnswer[]>([]);
    useEffect(() => {
        let hasAddedId = false;
        // eslint-disable-next-line
        props.questions.map((q) => {
            // eslint-disable-next-line
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
                        {i.questions.questions.options?.reference &&
                            props.questionnaireResource.map(
                                (qr) =>
                                    qr.id ===
                                        i.questions.questions.options?.reference?.slice(
                                            1,
                                        ) &&
                                    qr.compose.include.map((c) =>
                                        c.concept.map((co) => (
                                            <Title level={4} key={co.code}>
                                                {co.display}
                                            </Title>
                                        )),
                                    ),
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
