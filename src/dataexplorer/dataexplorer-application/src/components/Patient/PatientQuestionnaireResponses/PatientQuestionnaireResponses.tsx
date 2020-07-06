import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IDataSource } from 'types/IPatient';
import { Row, Spin } from 'antd';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import PatientQuestionnaire from './PatientQuestionnaire/PatientQuestionnaire';

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
    const { response: questionnaireResponses } = useFetch<
        IQuestionnaireResponse
    >(
        'fhir/QuestionnaireResponse?subject=Patient/' +
            patientData.entry[0].resource.id,
    );

    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
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
            {questionnaireResponses && questionnaireId && (
                <PatientQuestionnaire
                    setSchema={setSchema}
                    patientData={patientData}
                    questionnaireResponses={questionnaireResponses}
                    questionnaireId={questionnaireId}
                    questionnaireResponseData={QRData}
                />
            )}
            {!questionnaireId && !questionnaireResponses && (
                <Row justify="center">
                    <Spin size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaireResponses;
