import React, { useState, useEffect } from 'react';
import { Row, Spin } from 'antd';
import 'dayjs/locale/nb';
import Title from 'antd/lib/typography/Title';
import useFetch from 'utils/hooks/useFetch';
import dayjs from 'dayjs';
import {
  QuestionnaireResponse,
  Questionnaire,
  QuestionnaireResponseItem,
} from 'types/fhirTypes/fhir';

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
  const [answer, setAnswer] = useState<QuestionnaireResponseItem[]>([]);

  dayjs.locale('nb');
  const filledInDate = dayjs(schemaResponse.response?.authored).format(
    'DD/MM/YYYY HH:mm',
  );

  const updateAnswer = (update: QuestionnaireResponseItem) => {
    setAnswer((answer) => [...answer, update]);
  };

  useEffect(() => {
    const findAnswer = (list: QuestionnaireResponseItem) => {
      if (!list?.answer && !list.item) {
        return;
      }
      if (list.answer) {
        if (list.item) {
          updateAnswer(list);
          findAnswer(list);
        } else {
          updateAnswer(list);
        }
        return;
      } else {
        list.item && list.item.forEach((element) => findAnswer(element));
      }
    };
    if (schemaResponse.response?.item) {
      for (let a = 0; a < schemaResponse.response.item.length; a++) {
        findAnswer(schemaResponse.response.item[a]);
      }
    }
    return;
  }, [schemaResponse.response]);

  const displayQA = (answer: any) => {
    if (answer.answer[0].valueCoding) {
      return answer.text, answer.answer[0].valueCoding.display;
    }
    return answer.text, answer.answer[0].valueString;
  };
  if (answer && answer[0] !== undefined) {
    answer.forEach((i) => console.log(i.text, displayQA(i)));
  }

  console.log(answer);

  return (
    <>
      {schemaResponse && questionnaire && answer.length > 0 ? (
        <div style={{ marginBottom: '5rem' }}>
          <Row gutter={40} justify="center">
            <Title level={3}>{questionnaire.name}</Title>
          </Row>
          <Row justify="center">
            <Title level={3}>id - {schemaResponse.response?.id}</Title>
          </Row>
          <Row justify="center">Skjemaet ble fyllt ut: {filledInDate}</Row>
          {answer.map((i) => (
            <div key={i.linkId}>
              <h3>{i.text}</h3>
              <p>{displayQA(i)}</p>
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
