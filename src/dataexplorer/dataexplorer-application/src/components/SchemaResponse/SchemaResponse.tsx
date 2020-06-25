import React from 'react';
import { Row, Col } from 'antd';
import 'dayjs/locale/nb';
import Title from 'antd/lib/typography/Title';
import useFetch from 'utils/hooks/useFetch';
import dayjs from 'dayjs';
import { QuestionnaireResponse, Questionnaire } from 'types/fhirTypes/fhir';

const SchemaResponse = () => {
    const questionnaireResponseId = '5';
    const schemaResponse = useFetch<QuestionnaireResponse>(
        'fhir/QuestionnaireResponse/' + questionnaireResponseId,
    );
    const questionnaireUrl = schemaResponse.response?.questionnaire?.reference?.substr(
        schemaResponse.response?.questionnaire?.reference?.indexOf(
            'Questionnaire/',
        ),
    );
    const { response: questionnaire } = useFetch<Questionnaire>(
        'fhir/' + questionnaireUrl,
    );
    console.log(schemaResponse);
    console.log(questionnaire);
    dayjs.locale('nb');
    const filledInDate = dayjs(schemaResponse.response?.authored).format(
        'DD/MM/YYYY HH:mm',
    );
    const titleQuestionnaire = questionnaire?.item?.flatMap((i) => i.text);
    const firstQuestion = questionnaire?.item?.map((i) =>
        i.item?.map((i) => i.text),
    );
    const secondQuestion = questionnaire?.item?.map((i) =>
        i.item?.map((i2) => i2.item?.map((i3) => i3.text)),
    );
    console.log(secondQuestion);

    return (
        <>
            {schemaResponse && questionnaire ? (
                <div style={{ marginBottom: '5rem' }}>
                    <Row gutter={40} justify={'center'}>
                        <Title level={3}>
                            Skjema id:{schemaResponse.response?.id}
                        </Title>
                    </Row>
                    <Row justify={'center'}>
                        Skjemaet ble fyllt ut: {filledInDate}
                    </Row>
                    {questionnaire &&
                        titleQuestionnaire &&
                        schemaResponse &&
                        firstQuestion &&
                        secondQuestion &&
                        questionnaire.item?.map((q, i) => (
                            <div key={i} style={{ marginBottom: '1rem' }}>
                                <Row justify={'center'}>
                                    <Title level={4}>
                                        {titleQuestionnaire[i]}
                                    </Title>
                                </Row>
                                {firstQuestion[i] &&
                                    firstQuestion[i]?.map(
                                        (questions, index) => (
                                            <div key={index}>
                                                <Row justify={'center'}>
                                                    <Col
                                                        style={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {questions}
                                                    </Col>
                                                </Row>
                                                {secondQuestion[i] &&
                                                    secondQuestion[i]?.map(
                                                        (questions, index) => (
                                                            <Row
                                                                justify={
                                                                    'center'
                                                                }
                                                                key={index}
                                                            >
                                                                <Col>
                                                                    {questions}
                                                                </Col>
                                                            </Row>
                                                        ),
                                                    )}
                                            </div>
                                        ),
                                    )}
                            </div>
                        ))}
                </div>
            ) : (
                <Row justify={'center'}>
                    <Title level={4}>Venter på respons...</Title>
                </Row>
            )}
        </>
    );
};

export default SchemaResponse;
