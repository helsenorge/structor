import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier, IRecord } from 'types/IPatient';
import { message, Empty } from 'antd';
import './PatientInfo.style.scss';
import DisplayPatientInfo from './DisplayPatientInfo';

interface IPatientInfoProps {
    setName: (name: string) => void;
    setSchema: (id: string) => void;
    patientID?: string | null;
}

const PatientInfo = ({ patientID, setName, setSchema }: IPatientInfoProps) => {
    const handleClick = (record: IRecord) => {
        message.info('Du har valgt Skjema ' + record.id);
        setSchema(record.schemaName);
    };
    // The oid signifies that we are searching on social security number
    const { response: patientData, error } = useFetch<IPatientIdentifier>(
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' +
            patientID,
    );
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
