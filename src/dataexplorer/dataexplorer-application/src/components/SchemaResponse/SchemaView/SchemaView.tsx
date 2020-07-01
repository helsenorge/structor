import React, { useState, useEffect } from 'react';
import {
    IQuestionAndAnswer,
    IAnswer,
    IQuestion,
} from 'types/IQuestionAndAnswer';
import { ResourceContainer } from 'types/fhirTypes/fhir';
import Schemes from 'components/Schemes/Schemes';

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
            {qAndA && (
                <Schemes
                    qAndA={qAndA}
                    questionnaireResource={props.questionnaireResource}
                />
            )}
        </>
    );
};

export default SchemaView;
