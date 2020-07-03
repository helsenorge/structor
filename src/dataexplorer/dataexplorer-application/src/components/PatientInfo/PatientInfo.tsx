import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IRecord } from 'types/IPatient';
import { Empty, Row, Spin } from 'antd';
import './PatientInfo.style.scss';
import DisplayPatientInfo from './DisplayPatientInfo';
import { IQuestionnaireResponse } from 'types/IQuestionnaireResponse';
import { useHistory } from 'react-router-dom';

interface IPatientInfoProps {
    setName: (name: string) => void;
    setSchema: (id: string) => void;
    patientID?: string | null;
}

const PatientInfo = ({ patientID, setName, setSchema }: IPatientInfoProps) => {
    const history = useHistory();
    const [dataSource, setDataSource] = useState<fhir.ResourceBase[]>([]);
    const [QRData, setQRData] = useState<fhir.ResourceBase[]>([]);
    const [qResponse, setQResponse] = useState<string>();
    const { response: questionnaire } = useFetch<fhir.Questionnaire>(
        'fhir/' + qResponse,
    );

    // The oid signifies that we are searching on social security number
    const { response: patientData, error } = useFetch<IPatientIdentifier>(
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' +
            patientID,
    );

    const { response: questionnaireResponses } = useFetch<
        IQuestionnaireResponse
    >(
        'fhir/QuestionnaireResponse?subject=Patient/' +
            patientData?.entry[0].resource.id,
    );

    const handleClick = (record: IRecord) => {
        setSchema(record.id);
        history.push('/Pasient/skjema');
    };

    const catchQuestionaires = (item: fhir.QuestionnaireResponse) => {
        setQResponse(
            item.questionnaire?.reference?.substr(
                item.questionnaire?.reference?.indexOf('Questionnaire/'),
            ),
        );
    };

    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
            questionnaireResponses.entry.forEach((item) => {
                catchQuestionaires(item.resource);
                setQRData((QRData) => [
                    ...QRData,
                    {
                        id: item.resource.id,
                        schemaName: '',
                        submitted: item.resource.meta?.lastUpdated?.split(
                            'T',
                        )[0],
                    },
                ]);
            });
        }
    }, [questionnaireResponses]);

    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses?.total > 0) {
            QRData.forEach((item) => {
                setDataSource((dataSource) => [
                    ...dataSource,
                    {
                        id: item.id,
                        schemaName: questionnaire?.title,
                        submitted: item.meta?.lastUpdated?.split('T')[0],
                    },
                ]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionnaire]);

    if (patientData && patientData !== undefined && patientData.total !== 0) {
        const name =
            patientData.entry[0].resource.name[0].given[0] +
            ' ' +
            patientData.entry[0].resource.name[0].family;
        // Since the search uses social security number, which are
        // unique, the response will contain a maximum value of 1,
        // if the patient exists in the database.

        if (patientData.total === 1) {
            setName(name);
            return (
                <DisplayPatientInfo
                    patient={patientData.entry[0].resource}
                    handleClick={handleClick}
                    dataSource={dataSource}
                />
            );
        }
    }
    return (
        <>
            {!patientData && error.length === 0 && (
                <Row justify="space-around" align="middle">
                    <Spin size="large" />
                </Row>
            )}
            {patientData?.total === 0 && (
                <div className="failed-container">
                    <Empty
                        description={
                            <span>
                                Fant ingen pasienter med dette personnummeret
                            </span>
                        }
                    ></Empty>
                </div>
            )}
            {error.length > 0 && (
                <Empty
                    description={
                        <span>Feil ved lasting av pasienter: {error}</span>
                    }
                ></Empty>
            )}
        </>
    );
};

export default PatientInfo;
