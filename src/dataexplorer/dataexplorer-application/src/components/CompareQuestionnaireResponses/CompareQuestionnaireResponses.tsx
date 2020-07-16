import React, { useContext } from 'react';
import { Row } from 'antd';
import FecthSingleQuestionnaireResponses from './FetchSingleQuestionnaireResponses';
import { GlobalContext } from 'context/GlobalContext';
import { useHistory } from 'react-router-dom';

const CompareQuestionnaireResponses = () => {
    const { comparableSchemaNumbers } = useContext(GlobalContext);

    const history = useHistory();
    if (comparableSchemaNumbers.length === 0) {
        history.push('/');
        return <></>;
    }
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
