import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier } from 'types/IPatient';
import { Row, Spin } from 'antd';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import PatientView from './PatientQuestionnaire/PatientView/PatientView';
import PatientQuestionnaire from './PatientQuestionnaire/PatientQuestionnaire';

const PatientQuestionnaireResponses = (patientData: IPatientIdentifier) => {
    const [questionnaireId, setQuestionnaireId] = useState<string>('');
    const [responseExists, setResponseExists] = useState<boolean>(true);
    const { response: questionnaireResponses } = useFetch<IQuestionnaireResponse>(
        'fhir/QuestionnaireResponse?subject=Patient/' + patientData.entry[0].resource.id,
    );
    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
            setResponseExists(true);
            questionnaireResponses.entry.forEach((i) => {
                const q = i.resource.questionnaire?.reference
                    ?.substr(i.resource.questionnaire?.reference?.indexOf('Questionnaire/'))
                    .split('/')[1];
                q && setQuestionnaireId((questionnaireId) => questionnaireId + q + ',');
            });
        } else if (questionnaireResponses && questionnaireResponses.total === 0) {
            setResponseExists(false);
        }
    }, [questionnaireResponses]);

    return (
        <>
            {questionnaireResponses && questionnaireId && responseExists && (
                <PatientQuestionnaire
                    patientData={patientData}
                    questionnaireResponses={questionnaireResponses}
                    questionnaireId={questionnaireId}
                />
            )}
            {/* Patients without QuestionnaireResponses do not need to fetch for Questionnaires*/}
            {!responseExists && questionnaireResponses && questionnaireResponses.total === 0 && (
                <PatientView
                    patient={patientData.entry[0].resource}
                    dataSource={[]}
                    hasQuestionnaireResponses={false}
                />
            )}
            {!questionnaireResponses && responseExists && (
                <Row justify="center">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaireResponses;
