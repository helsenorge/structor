import React, { useContext, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatientIdentifier } from 'types/IPatient';
import { Empty, Row, Spin } from 'antd';
import PatientQuestionnaireResponses from './PatientQuestionnaireResponses/PatientQuestionnaireResponses';
import { BreadcrumbContext } from 'components/Navigation/Breadcrumbs/BreadcrumbContext';
import './Patient-style.scss';

interface IPatientProps {
    patientID: string | null;
}

const Patient = () => {
    const { patientId, setSchemanumber, setName } = useContext(BreadcrumbContext);
    // The oid signifies that we are searching on social security number
    const { response: patientData, error } = useFetch<IPatientIdentifier>(
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' + patientId,
    );
    useEffect(() => {
        setSchemanumber('');
    }, [setSchemanumber]);

    useEffect(() => {
        if (patientData && patientData.total === 1) {
            patientData && setName(patientData?.entry[0].resource.name[0].given[0]);
        }
    }, [patientData, setName]);

    return (
        <>
            {!patientData && (!error || error.length === 0) && (
                <Row justify="center">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
            {patientData?.total === 0 && (
                <Empty
                    className="empty-container"
                    description={<span>Fant ingen pasienter med personnummer {patientId}</span>}
                />
            )}
            {error.length > 0 && (
                <Empty
                    className="empty-container"
                    description={<span>Feil ved lasting av pasienter: {error}</span>}
                ></Empty>
            )}
            {/*  Since the search uses social security number, which are
                unique, the response will contain a maximum value of 1,
                if the patient exists in the database. */}
            {patientData && patientData.total === 1 && <PatientQuestionnaireResponses {...patientData} />}
        </>
    );
};

export default Patient;
