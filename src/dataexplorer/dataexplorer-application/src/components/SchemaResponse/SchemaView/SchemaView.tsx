import React, { useState, useEffect } from 'react';
import { IQA, IAnswer, IQuestion } from 'types/IQuestionnaireResponse';

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
    return <h1>Hei</h1>;
};

export default SchemaView;
