import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatient } from 'types/IPatient';

const PatientInfo = ({ patientID }: any) => {
    const { response } = useFetch<IPatient>('fhir/Patient/' + patientID);

    console.log(response);

    if (response && response !== undefined) {
        return displayPatientInfo(response);
    }
    return <div>no information</div>;
};

const displayPatientInfo = (response: IPatient) => {
    return (
        <>
            <div>navn: {response.name[0].given[0]}</div>
            <div>kjønn: {response.gender} </div>
            <div>Fødselsdato: {response.birthDate} </div>
            <div>Etternavn: {response.name[0].family} </div>
            <div>ID: {response.id}</div>
        </>
    );
};

export default PatientInfo;
