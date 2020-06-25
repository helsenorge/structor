import React from 'react';
import { Row, Col, Spin } from 'antd';
import 'dayjs/locale/nb';
import Title from 'antd/lib/typography/Title';
import useFetch from 'utils/hooks/useFetch';
import dayjs from 'dayjs';
import { QuestionnaireResponse, Questionnaire } from 'types/fhirTypes/fhir';

const SchemaResponse = () => {
  const questionnaireResponseId = '10';
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
  const thirdQuestion = questionnaire?.item?.map((i) =>
    i.item?.map((i2) => i2.item?.map((i3) => i3.item?.map((i4) => i4.text))),
  );
  return (
    <>
      {schemaResponse && questionnaire ? (
        <div style={{ marginBottom: '5rem' }}>
          <Row gutter={40} justify="center">
            <Title level={3}>{questionnaire.name}</Title>
          </Row>
          <Row justify="center">
            <Title level={3}>id - {schemaResponse.response?.id}</Title>
          </Row>
          <Row justify="center">Skjemaet ble fyllt ut: {filledInDate}</Row>
          {questionnaire &&
            titleQuestionnaire &&
            schemaResponse &&
            firstQuestion &&
            secondQuestion &&
            thirdQuestion &&
            questionnaire.item?.map((q, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <Row justify="center">
                  <Title level={4}>{titleQuestionnaire[i]}</Title>
                </Row>
                {firstQuestion[i] &&
                  firstQuestion[i]?.map((questions, findex) => (
                    <div key={findex}>
                      <Row justify="center">
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
                          (questions, sindex) =>
                            sindex === findex && (
                              <div key={sindex}>
                                {questions && questions.length > 1 ? (
                                  questions?.map((q) => (
                                    <Row justify="center" key={sindex}>
                                      <Col style={{ color: 'blue' }}>{q}</Col>
                                    </Row>
                                  ))
                                ) : (
                                  <Row justify="center" key={sindex}>
                                    <Col style={{ color: 'blue' }}>
                                      {questions}
                                    </Col>
                                  </Row>
                                )}
                                {thirdQuestion[i] &&
                                  thirdQuestion[i]?.map(
                                    (question, tindex) =>
                                      tindex === sindex && (
                                        <div key={tindex}>
                                          {question && question.length > 1 ? (
                                            question?.map((q, id) => (
                                              <Row justify="center" key={id}>
                                                <Col
                                                  style={{
                                                    color: 'green',
                                                    marginBottom: '1rem',
                                                  }}
                                                >
                                                  {q}
                                                </Col>
                                              </Row>
                                            ))
                                          ) : (
                                            <Row justify="center" >
                                              <Col
                                                style={{
                                                  color: 'green',
                                                  marginBottom: '1rem',
                                                }}
                                              >
                                                {question}
                                              </Col>
                                            </Row>
                                          )}
                                        </div>
                                      ),
                                  )}
                              </div>
                            ),
                        )}
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ) : (
        <Row justify="center">
          <Spin size="large" />
        </Row>
      )}
    </>
  );
};

export default SchemaResponse;
