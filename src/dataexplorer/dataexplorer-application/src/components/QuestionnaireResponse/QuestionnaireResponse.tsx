import React, { useContext } from 'react';
import { Row, Spin } from 'antd';
import 'dayjs/locale/nb';
import useFetch from 'utils/hooks/useFetch';
import QuestionnaireResponseProcessing from './QuestionnaireResponseProcessing/QuestionnaireResponseProcessing';
import { GlobalContext } from 'context/GlobalContext';
import { useHistory } from 'react-router-dom';

const QuestionnaireResponse = () => {
    const { schemaNumber } = useContext(GlobalContext);
    const { response: questionnaireResponse, error: qrError } = useFetch<fhir.QuestionnaireResponse>(
        'fhir/QuestionnaireResponse/' + schemaNumber,
    );
    const history = useHistory();

    const questionnaireUrl = questionnaireResponse?.questionnaire?.reference?.substr(
        questionnaireResponse?.questionnaire?.reference?.indexOf('Questionnaire/'),
    );
    if (!schemaNumber) {
        history.push('/');
        return <></>;
    }
    return (
        <>
            {questionnaireResponse && questionnaireUrl && (
                <QuestionnaireResponseProcessing
                    questionnaireUrl={questionnaireUrl}
                    schemaResponse={questionnaireResponse}
                />
            )}
            {!questionnaireResponse && qrError.length === 0 && (
                <Row justify="space-around" align="middle">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
            {qrError.length > 0 && <Row justify="center">Feil ved lasting av skjema: {qrError}</Row>}
        </>
    );
};

export default QuestionnaireResponse;
