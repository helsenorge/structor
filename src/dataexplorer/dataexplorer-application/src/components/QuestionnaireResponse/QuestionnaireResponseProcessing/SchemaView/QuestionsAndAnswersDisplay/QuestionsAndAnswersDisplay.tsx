import React from 'react';
import { IQuestionAndAnswer } from 'types/IQuestionAndAnswer';
import { Popover, Button } from 'antd';
import '../SchemaView.style.scss';

export interface IQuestionsAndAnswersDisplayProps {
    questionAndAnswer: IQuestionAndAnswer;
    questionnaireResource: fhir.ValueSet[];
    questionAndAnswerIndex: number;
}

const QuestionsAndAnswersDisplay = (props: IQuestionsAndAnswersDisplayProps) => {
    const setContent = (data: fhir.ValueSetComposeIncludeConcept[]) => {
        if (data) {
            return data.map((line) => <li key={line.code}>{line.display}</li>);
        }
        return;
    };
    const setCount = (data: fhir.ValueSetComposeIncludeConcept[]) => {
        if (data.length > 6) {
            return 'scroll';
        }
        return 'notscroll';
    };

    return (
        <>
            <div className="question-alternative-container">
                <p className="questions">{props.questionAndAnswer.questions.questions.text}</p>
                {props.questionnaireResource.map(
                    (qr) =>
                        qr.id === props.questionAndAnswer.questions.questions.options?.reference?.slice(1) &&
                        qr.compose &&
                        (props.questionnaireResource.length > 0
                            ? qr.compose.include.map(
                                  (m) =>
                                      m.concept && (
                                          <Popover
                                              key={m.system}
                                              placement="rightTop"
                                              trigger="click"
                                              content={
                                                  <div className={setCount(m.concept)}>{setContent(m.concept)}</div>
                                              }
                                          >
                                              <Button type="primary" size="small">
                                                  <p className="alternatives">Alternativer</p>
                                              </Button>
                                          </Popover>
                                      ),
                              )
                            : null),
                )}
            </div>

            {props.questionAndAnswer.answers?.answers.answer?.map((item) => (
                <div
                    className="answers"
                    key={
                        item.valueCoding?.display
                            ? props.questionAndAnswer.answers?.id + item.valueCoding.display
                            : props.questionAndAnswer.answers?.id
                    }
                >
                    {item.valueBoolean && <p>Sant</p>}
                    {item.valueBoolean === false && <p>Usant</p>}
                    {item.valueCoding?.display}
                    {item.valueDate}
                    {item.valueDateTime?.replace('T', ' ')}
                    {item.valueDecimal}
                    {item.valueString}
                </div>
            ))}
        </>
    );
};

export default QuestionsAndAnswersDisplay;