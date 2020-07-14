import React, { useContext } from 'react';
import { Row } from 'antd';
import FecthSingleQuestionnaireResponses from './FetchSingleQuestionnaireResponses';
import { PatientContext } from 'components/Patient/PatientContext';

const CompareQuestionnaireResponses = () => {
    const { comparableSchemaNumbers } = useContext(PatientContext);

    return (
        <>
            <Row>
                {comparableSchemaNumbers &&
                    comparableSchemaNumbers.map((i) => (
                        <FecthSingleQuestionnaireResponses questionnaireResponseId={i} key={i} />
                    ))}
            </Row>
        </>
    );
};

export default CompareQuestionnaireResponses;
