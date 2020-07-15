import React, { useEffect, useContext, useState } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier } from 'types/IPatient';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import PatientQuestionnaire from 'components/Patient/PatientQuestionnaireResponses/PatientQuestionnaire/PatientQuestionnaire';
import { Spin, Row } from 'antd';
import FetchQuestionnaires from './FetchQuestionnaires';
import { GlobalContext } from 'context/GlobalContext';

const FetchQuestionnaireResponses = (patientData: IPatientIdentifier) => {
    const { response: questionnaireResponses } = useFetch<IQuestionnaireResponse>(
        'fhir/QuestionnaireResponse?subject=Patient/' + patientData.entry[0].resource.id,
    );
    const [questionnaireId, setQuestionnaireId] = useState<string>('');
    const { questionnaire, setQuestionnaireResponse } = useContext(GlobalContext);

    useEffect(() => {
        if (questionnaireResponses) {
            setQuestionnaireResponse(questionnaireResponses);
        }
    }, [questionnaireResponses, setQuestionnaireResponse]);
    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
            questionnaireResponses.entry.forEach((i) => {
                const q = i.resource.questionnaire?.reference
                    ?.substr(i.resource.questionnaire?.reference?.indexOf('Questionnaire/'))
                    .split('/')[1];
                q && setQuestionnaireId((questionnaireId) => questionnaireId + q + ',');
            });
        }
    }, [questionnaireResponses]);

    if (questionnaireResponses && questionnaireResponses.entry !== undefined && questionnaire.entry !== undefined) {
        return <> {questionnaireResponses && <PatientQuestionnaire />}</>;
    }
    if (questionnaireId) {
        return <>{<FetchQuestionnaires questionnaireId={questionnaireId} />} </>;
    }
    return (
        <>
            <Row justify="center">
                <Spin className="spin-container" size="large" />
            </Row>
        </>
    );
};

export default FetchQuestionnaireResponses;
