import React, { useContext, useEffect } from 'react';
import { IPatientIdentifier } from 'types/IPatient';
import useFetch from 'utils/hooks/useFetch';
import { Row, Spin } from 'antd';
import { Link } from 'react-router-dom';
import './PatientPreview.style.scss';
import { GlobalContext } from 'context/GlobalContext';

const PatientPreview = () => {
    const { patientId, setPatient } = useContext(GlobalContext);
    const { response: patientData } = useFetch<IPatientIdentifier>(
        // The oid signifies that we are searching on social security number
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' + patientId,
    );

    useEffect(() => {
        patientData && patientData?.total === 1 && setPatient(patientData);
    }, [patientData, setPatient]);

    return (
        <>
            {!patientData && (
                <Row justify="center">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
            {patientId !== '' && patientData && patientData.total === 0 && (
                <div className="drawer-container">
                    <p>Fant ingen pasienter med personnummer {patientId} </p>
                </div>
            )}
            {patientId !== '' && patientData && patientData.total === 1 && (
                <>
                    <Link to="/pasient">
                        <div className="drawer-container">
                            <p>
                                {patientData.entry[0].resource.name[0].given[0] +
                                    ' ' +
                                    patientData.entry[0].resource.name[0].family}
                            </p>
                        </div>
                    </Link>
                </>
            )}
        </>
    );
};

export default PatientPreview;
