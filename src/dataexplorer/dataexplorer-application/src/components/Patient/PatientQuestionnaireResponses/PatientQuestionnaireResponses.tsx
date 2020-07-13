import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IDataSource } from 'types/IPatient';
import { Row, Spin } from 'antd';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import PatientQuestionnaire from './PatientQuestionnaire/PatientQuestionnaire';
import PatientView from './PatientQuestionnaire/PatientView/PatientView';
import '../Patient-style.scss';
import dayjs from 'dayjs';

export interface ITitleDict {
    id: string;
}
const PatientQuestionnaireResponses = (patientData: IPatientIdentifier) => {
    const [questionnaireId, setQuestionnaireId] = useState<string>('');
    const [QRData, setQRData] = useState<IDataSource[]>([]);
    const [responseExists, setResponseExists] = useState<boolean>(true);
    const { response: questionnaireResponses } = useFetch<IQuestionnaireResponse>(
        'fhir/QuestionnaireResponse?subject=Patient/' + patientData.entry[0].resource.id,
    );
    const { response: questionnaire } = useFetch<IQuestionnaire>('fhir/Questionnaire?_id=' + questionnaireId);
    console.log(QRData);
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

    useEffect(() => {
        const qdict = new Map();
        questionnaire?.entry.forEach((j) => {
            qdict.set(j.resource?.id, j.resource?.title);
        });
        questionnaireResponses?.entry.forEach((k) => {
            setQRData((QRData) => [
                ...QRData,
                {
                    id: k.resource.id,
                    schemaName: qdict.get(
                        k.resource.questionnaire?.reference
                            ?.substr(k.resource.questionnaire?.reference?.indexOf('Questionnaire/'))
                            .split('/')[1],
                    ),
                    submitted: k.resource.meta?.lastUpdated,
                },
            ]);
        });
        console.log(qdict);
    }, [questionnaire]);

    return (
        <>
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
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaireResponses;
