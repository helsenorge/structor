import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IRecord, IDataSource } from 'types/IPatient';
import { Row, Spin } from 'antd';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import { useHistory } from 'react-router-dom';
import PatientView from './PatientView/PatientView';

interface IPatientQuestionnaireProps {
    setSchema: (id: string) => void;
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
    setSchema,
}: IPatientQuestionnaireProps) => {
    const history = useHistory();
    const [dataSource, setDataSource] = useState<fhir.ResourceBase[]>([]);

    const { response: questionnaire } = useFetch<fhir.Questionnaire>(
        'fhir/' + questionnaireId,
    );

    const handleClick = (record: IRecord) => {
        setSchema(record.id);
        history.push('/pasient/skjema');
    };

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
            {questionnaire && (
                <PatientView
                    patient={patientData.entry[0].resource}
                    handleClick={handleClick}
                    dataSource={dataSource}
                />
            )}
            {!questionnaire && !dataSource && (
                <Row justify="space-around" align="middle">
                    <Spin size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaire;
