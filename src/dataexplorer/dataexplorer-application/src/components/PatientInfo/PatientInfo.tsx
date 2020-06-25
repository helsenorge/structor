import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatient, IPatientIdentifier } from 'types/IPatient';
import PatientQuestionnaireResponses from '../PatientQuestionnaireResponses/PatientQuestionnaireResponses';

const PatientInfo = ({ patientID }: any) => {
    // The oid signifies that we are searching on social security number
    const { response: patientData } = useFetch<IPatientIdentifier>(
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' +
            patientID,
    );

    if (patientData && patientData !== undefined) {
        // Since the search uses social security number, which are
        // unique, the response will contain a maximum value of 1,
        // if the patient exists in the database.
        if (patientData.total === 1) {
            return displayPatientInfo(patientData.entry[0].resource);
        }
    }
    return <div>Fant ingen pasienter med dette personnummeret</div>;
};

const displayPatientInfo = (response: IPatient) => {
    if (response) {
        return (
            <>
                <div>
                    <div>navn: {response.name[0].given[0]}</div>
                    <div>kjønn: {response.gender} </div>
                    <div>Fødselsdato: {response.birthDate} </div>
                    <div>Etternavn: {response.name[0].family} </div>
                    <div>ID: {response.id}</div>
                </div>
                <div>
                    <PatientQuestionnaireResponses patientID={response.id} />
                </div>
            </>
        );
    }
    return <div>Fant ikke pasienten</div>;
};

export default PatientInfo;
