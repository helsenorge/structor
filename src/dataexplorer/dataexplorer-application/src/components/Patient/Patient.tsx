import React, { useContext, useEffect } from 'react';
import PatientQuestionnaireResponses from './PatientQuestionnaireResponses/PatientQuestionnaireResponses';
import './Patient-style.scss';
import { PatientContext } from './PatientContext';

interface IPatientProps {
    patientID: string | null;
}

const Patient = () => {
    const { patient: patientData, setSchemanumber, setName } = useContext(PatientContext);
    // The oid signifies that we are searching on social security number
    useEffect(() => {
        setSchemanumber('');
    }, [setSchemanumber]);

    useEffect(() => {
        if (patientData && patientData.total === 1) {
            const name = `${patientData?.entry[0].resource.name[0].given[0]} ${patientData?.entry[0].resource.name[0].family}`;
            setName(name);
        }
    }, [patientData, setName]);

    return <>{patientData && patientData.total === 1 && <PatientQuestionnaireResponses {...patientData} />}</>;
};

export default Patient;
