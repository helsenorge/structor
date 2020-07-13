import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IDataSource } from 'types/IPatient';
import { Row, Spin } from 'antd';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import PatientQuestionnaire from './PatientQuestionnaire/PatientQuestionnaire';
import PatientView from './PatientQuestionnaire/PatientView/PatientView';

const PatientQuestionnaireResponses = (patientData: IPatientIdentifier) => {
    const [questionnaireId, setQuestionnaireId] = useState<string>();
    const [QRData, setQRData] = useState<IDataSource[]>([]);
    const [responseExists, setResponseExists] = useState<boolean>(true);
    const { response: questionnaireResponses } = useFetch<IQuestionnaireResponse>(
        'fhir/QuestionnaireResponse?subject=Patient/' + patientData.entry[0].resource.id,
    );

    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
            setResponseExists(true);
            questionnaireResponses.entry.forEach((i) => {
                setQuestionnaireId(
                    i.resource.questionnaire?.reference?.substr(
                        i.resource.questionnaire?.reference?.indexOf('Questionnaire/'),
                    ),
                );
                setQRData((QRData) => [
                    ...QRData,
                    {
                        id: i.resource.id,
                        schemaName: '',
                        submitted: i.resource.meta?.lastUpdated?.split('T')[0],
                    },
                ]);
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
                    questionnaireResponseData={QRData}
                />
            )}
            {/* Patients without QuestionnaireResponses do not need to fetch for Questionnaires*/}
            {!responseExists && questionnaireResponses && questionnaireResponses.total === 0 && (
                <PatientView
                    patient={patientData.entry[0].resource}
                    dataSource={QRData}
                    hasQuestionnaireResponses={false}
                />
            )}
            {!questionnaireResponses && responseExists && (
                <Row justify="center">
                    <Spin className="empty-container" size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaireResponses;
