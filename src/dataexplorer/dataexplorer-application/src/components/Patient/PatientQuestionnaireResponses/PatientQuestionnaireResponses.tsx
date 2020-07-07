import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IDataSource } from 'types/IPatient';
import { Row, Spin } from 'antd';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import PatientQuestionnaire from './PatientQuestionnaire/PatientQuestionnaire';
import PatientView from './PatientQuestionnaire/PatientView/PatientView';

interface IPatientQuestionnaireResponsesProps {
    patientData: IPatientIdentifier;
    setSchema: (id: string) => void;
}

const PatientQuestionnaireResponses = ({
    patientData,
    setSchema,
}: IPatientQuestionnaireResponsesProps) => {
    const [questionnaireId, setQuestionnaireId] = useState<string>();
    const [QRData, setQRData] = useState<IDataSource[]>([]);
    const [responseExists, setResponseExists] = useState<boolean>(false);
    const { response: questionnaireResponses } = useFetch<
        IQuestionnaireResponse
    >(
        'fhir/QuestionnaireResponse?subject=Patient/' +
            patientData.entry[0].resource.id,
    );

    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
            setResponseExists(true);
            questionnaireResponses.entry.forEach((i) => {
                setQuestionnaireId(
                    i.resource.questionnaire?.reference?.substr(
                        i.resource.questionnaire?.reference?.indexOf(
                            'Questionnaire/',
                        ),
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
        }
    }, [questionnaireResponses]);

    return (
        <>
            {questionnaireResponses && questionnaireId && responseExists && (
                <PatientQuestionnaire
                    setSchema={setSchema}
                    patientData={patientData}
                    questionnaireResponses={questionnaireResponses}
                    questionnaireId={questionnaireId}
                    questionnaireResponseData={QRData}
                />
            )}
            {/* Patients without QuestionnaireResponses do not need to fetch for Questionnaires*/}
            {!responseExists && (
                <PatientView
                    patient={patientData.entry[0].resource}
                    setSchema={setSchema}
                    dataSource={QRData}
                />
            )}
            {!questionnaireResponses && !questionnaireId && responseExists && (
                <Row justify="center">
                    <Spin size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaireResponses;