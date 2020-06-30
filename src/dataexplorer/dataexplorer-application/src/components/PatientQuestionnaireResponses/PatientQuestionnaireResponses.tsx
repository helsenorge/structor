import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';

const PatientQuestionnnaireResponses = ({ patientID }: any) => {
    const { response: questionnaireResponses } = useFetch<
        IQuestionnaireResponse
    >('fhir/QuestionnaireResponse?subject=Patient/' + patientID);
    if (questionnaireResponses) {
        return (
            <h1>
                Pasienten har {questionnaireResponses.entry.length} utfylte
                skjemaer
            </h1>
        );
    }
    return <></>;
};

export default PatientQuestionnnaireResponses;
