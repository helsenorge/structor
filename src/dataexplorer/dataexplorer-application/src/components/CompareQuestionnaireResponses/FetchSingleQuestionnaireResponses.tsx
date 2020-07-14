import useFetch from 'utils/hooks/useFetch';
import React, { ReactText } from 'react';
import QuestionnaireResponseProcessing from 'components/QuestionnaireResponse/QuestionnaireResponseProcessing/QuestionnaireResponseProcessing';
import { Row, Col, Spin } from 'antd';
import './FetchSingleQuestionnaireResponses.style.scss';

const FecthSingleQuestionnaireResponses = (props: { questionnaireResponseId: ReactText }) => {
    const { response: questionnaireResponse, error: qrError } = useFetch<fhir.QuestionnaireResponse>(
        'fhir/QuestionnaireResponse/' + props.questionnaireResponseId,
    );

    const questionnaireUrl = questionnaireResponse?.questionnaire?.reference?.substr(
        questionnaireResponse?.questionnaire?.reference?.indexOf('Questionnaire/'),
    );

    return (
        <>
            {questionnaireResponse && questionnaireUrl && (
                <Col span={12} className="schemes-position scroll-box" key={questionnaireResponse?.id}>
                    <QuestionnaireResponseProcessing
                        questionnaireUrl={questionnaireUrl}
                        schemaResponse={questionnaireResponse}
                    />
                </Col>
            )}
            {!questionnaireResponse && qrError.length === 0 && (
                <Row justify="center">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
            {qrError.length > 0 && <Row justify="center">Feil ved lasting av skjema: {qrError}</Row>}
        </>
    );
};

export default FecthSingleQuestionnaireResponses;
