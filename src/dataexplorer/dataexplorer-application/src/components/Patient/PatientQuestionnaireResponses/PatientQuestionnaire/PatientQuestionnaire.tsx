import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IDataSource } from 'types/IPatient';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import PatientView from './PatientView/PatientView';
import { Row, Spin } from 'antd';

interface IPatientQuestionnaireProps {
    patientData: IPatientIdentifier;
    questionnaireResponses: IQuestionnaireResponse;
    questionnaireId: string;
    questionnaireResponseData: IDataSource[];
}

const PatientQuestionnaire = ({
    patientData,
    questionnaireResponses,
    questionnaireId,
    questionnaireResponseData,
}: IPatientQuestionnaireProps) => {
    const [dataSource, setDataSource] = useState<fhir.ResourceBase[]>([]);

    const { response: questionnaire } = useFetch<fhir.Questionnaire>(
        'fhir/' + questionnaireId,
    );

    useEffect(() => {
        if (
            questionnaire &&
            questionnaireResponses &&
            questionnaireResponses?.total > 0
        ) {
            questionnaireResponseData.forEach((item) => {
                setDataSource((dataSource) => [
                    ...dataSource,
                    {
                        id: item.id,
                        schemaName: questionnaire?.title,
                        submitted: item.submitted,
                    },
                ]);
            });
        }
        // eslint-disable-next-line
    }, [questionnaire]);

    return (
        <>
            {questionnaire && dataSource && (
                <PatientView
                    patient={patientData.entry[0].resource}
                    dataSource={dataSource}
                    hasQuestionnaireResponses={true}
                />
            )}
            {!questionnaire && (
                <Row justify="center">
                    <Spin size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaire;
