import React from 'react';
import { Row, Spin } from 'antd';
import 'dayjs/locale/nb';
import useFetch from 'utils/hooks/useFetch';
import SchemaResponse from './SchemaResponse/SchemaResponse';

const QuestionnaireResponse = (props: { questionnaireResponseId: string }) => {
    const { response: questionnaireResponse, error: qrError } = useFetch<
        fhir.QuestionnaireResponse
    >('fhir/QuestionnaireResponse/' + props.questionnaireResponseId);

    const questionnaireUrl = questionnaireResponse?.questionnaire?.reference?.substr(
        questionnaireResponse?.questionnaire?.reference?.indexOf(
            'Questionnaire/',
        ),
    );
    return (
        <>
            {questionnaireResponse && questionnaireUrl && (
                <SchemaResponse
                    questionnaireUrl={questionnaireUrl}
                    schemaResponse={questionnaireResponse}
                />
            )}
            {!questionnaireResponse && qrError.length === 0 && (
                <Row justify="space-around" align="middle">
                    <Spin size="large" />
                </Row>
            )}
            {qrError.length > 0 && (
                <Row justify="center">
                    Feil ved lasting av skjema: {qrError}
                </Row>
            )}
        </>
    );
};

export default QuestionnaireResponse;
