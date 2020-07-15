import React, { useContext } from 'react';
import { Row } from 'antd';
import FecthSingleQuestionnaireResponses from './FetchSingleQuestionnaireResponses';
import { GlobalContext } from 'context/GlobalContext';

const CompareQuestionnaireResponses = () => {
    const { comparableSchemaNumbers } = useContext(GlobalContext);

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
