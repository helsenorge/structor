import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';

const PatientQuestionnnaireResponses = ({ patientID }: any) => {
    const { response: patientQuestionnaireResponses } = useFetch<
        IQuestionnaireResponse
    >('fhir/QuestionnaireResponse?subject=Patient/' + patientID);
    if (patientQuestionnaireResponses) {
        return (
            <h1>
                Pasienten har {patientQuestionnaireResponses.entry.length}{' '}
                utfylte skjemaer
            </h1>
        );
    }
    return <></>;
};

export default PatientQuestionnnaireResponses;
