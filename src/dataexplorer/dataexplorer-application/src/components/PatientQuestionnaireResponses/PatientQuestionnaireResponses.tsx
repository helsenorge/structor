import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IQuestionnaireResponses } from 'types/IQuestionnaireResponse';

const PatientQuestionnnaireResponses = ({ patientID }: any) => {
    const { response: questionnaireResponses } = useFetch<
        IQuestionnaireResponses
    >('fhir/QuestionnaireResponse?subject=Patient/' + patientID);
    if (questionnaireResponses) {
        console.log(questionnaireResponses);
        return (
            <h1>
                Pasienten har {questionnaireResponses.total} utfylte skjemaer
            </h1>
        );
    }
    return <></>;
};

export default PatientQuestionnnaireResponses;
