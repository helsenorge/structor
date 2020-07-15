import React, { useContext, useEffect } from 'react';
import PatientQuestionnaireResponses from './PatientQuestionnaireResponses/PatientQuestionnaireResponses';
import './Patient-style.scss';
import FetchQuestionnaireResponses from 'components/QuestionnaireResponse/FetchQuestionnaireResponses';
import { GlobalContext } from 'context/GlobalContext';

const Patient = () => {
    const {
        patient: patientData,
        setSchemanumber,
        setName,
        setComparableSchemaNumbers,
        questionnaireResponse,
        questionnaire,
    } = useContext(GlobalContext);
    // The oid signifies that we are searching on social security number
    useEffect(() => {
        setSchemanumber('');
        setComparableSchemaNumbers([]);
    }, [setSchemanumber, setComparableSchemaNumbers]);

    useEffect(() => {
        if (patientData && patientData.total === 1) {
            const name = `${patientData?.entry[0].resource.name[0].given[0]} ${patientData?.entry[0].resource.name[0].family}`;
            setName(name);
        }
    }, [patientData, setName]);
    if (
        questionnaireResponse.total === undefined ||
        (questionnaire.entry === undefined && questionnaireResponse.total !== 0)
    ) {
        return (
            <>
                <FetchQuestionnaireResponses {...patientData} />
            </>
        );
    }

    return <>{patientData && patientData.total === 1 && <PatientQuestionnaireResponses />}</>;
};

export default Patient;
