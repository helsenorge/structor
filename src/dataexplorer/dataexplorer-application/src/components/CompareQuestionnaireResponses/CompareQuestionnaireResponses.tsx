import React, { useContext } from 'react';
import { BreadcrumbContext } from 'components/Navigation/Breadcrumbs/BreadcrumbContext';
import { Row } from 'antd';
import FecthSingleQuestionnaireResponses from './FetchSingleQuestionnaireResponses';

const CompareQuestionnaireresponses = () => {
    const { comparableSchemaNumbers } = useContext(BreadcrumbContext);

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

export default CompareQuestionnaireresponses;
