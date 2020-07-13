import React, { useContext } from 'react';
import { BreadcrumbContext } from 'components/Navigation/Breadcrumbs/BreadcrumbContext';
import { IPatientIdentifier } from 'types/IPatient';
import useFetch from 'utils/hooks/useFetch';
import { Row, Spin } from 'antd';
import { Link } from 'react-router-dom';

const PatientPreview = () => {
    const { patientId } = useContext(BreadcrumbContext);

    const { response: patientData } = useFetch<IPatientIdentifier>(
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' + patientId,
    );

    return (
        <>
            {!patientData && (
                <Row justify="center">
                    <Spin size="large" />
                </Row>
            )}
            {patientId !== '' && patientData && patientData.total === 0 && (
                <p>Fant ingen pasienter med personnummer {patientId} </p>
            )}
            {patientId !== '' && patientData && patientData.total === 1 && (
                <Link to="/pasient">
                    Pasienten heter
                    {patientData.entry[0].resource.name[0].given[0] + patientData.entry[0].resource.name[0].family}{' '}
                </Link>
            )}
        </>
    );
};

export default PatientPreview;
