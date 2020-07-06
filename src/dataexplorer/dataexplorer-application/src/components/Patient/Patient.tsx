import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IRecord, IDataSource } from 'types/IPatient';
import { Empty, Row, Spin } from 'antd';
import './PatientInfo.style.scss';
import DisplayPatientInfo from './DisplayPatientInfo';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import { useHistory } from 'react-router-dom';

interface IPatientProps {
    setSchema: (id: string) => void;
    patientID: string | null;
}

const Patient = ({ patientID, setSchema }: IPatientProps) => {
    // The oid signifies that we are searching on social security number
    const { response: patientData, error } = useFetch<IPatientIdentifier>(
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' +
            patientID,
    );

    return (
        <>
            {!patientData && (!error || error.length === 0) && (
                <Row justify="center">
                    <Spin size="large" />
                </Row>
            )}
            {patientData?.total === 0 && (
                <Empty
                    description={
                        <span>
                            Fant ingen pasienter med dette personnummeret
                        </span>
                    }
                />
            )}
            {error.length > 0 && (
                <Empty
                    description={
                        <span>Feil ved lasting av pasienter: {error}</span>
                    }
                ></Empty>
            )}
            {
                // Since the search uses social security number, which are
                //  unique, the response will contain a maximum value of 1,
                // if the patient exists in the database.
            }
            {patientData && patientData.total === 1 && (
                <PatientQuestionnaireResponses
                    setSchema={setSchema}
                    patientData={patientData}
                />
            )}
        </>
    );
};

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
                <PatientInfo
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

interface IPatientInfoProps {
    setSchema: (id: string) => void;
    patientData: IPatientIdentifier;
    questionnaireResponses: IQuestionnaireResponse;
    questionnaireId: string;
    questionnaireResponseData: IDataSource[];
}

const PatientInfo = ({
    patientData,
    questionnaireResponses,
    questionnaireId,
    questionnaireResponseData,
    setSchema,
}: IPatientInfoProps) => {
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
                <DisplayPatientInfo
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

export default Patient;
