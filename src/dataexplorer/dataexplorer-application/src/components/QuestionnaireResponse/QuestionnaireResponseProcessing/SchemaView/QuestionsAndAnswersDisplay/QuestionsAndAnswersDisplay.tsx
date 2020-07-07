import React from 'react';
import { IQuestionAndAnswer } from 'types/IQuestionAndAnswer';
import { Popover, Button, Tooltip } from 'antd';
import '../SchemaView.style.scss';

export interface IQuestionsAndAnswersDisplayProps {
    questionAndAnswer: IQuestionAndAnswer;
    questionnaireResource: fhir.ValueSet[];
    questionAndAnswerIndex: number;
}

const QuestionsAndAnswersDisplay = (
    props: IQuestionsAndAnswersDisplayProps,
) => {
    const setContent = (data: fhir.ValueSetComposeIncludeConcept[]) => {
        if (data) {
            console.log(data);
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
        <div className="answer-container">
            <div className="question-container">
                <p className="questions">
                    {props.questionAndAnswer.questions.questions.text}
                </p>
                {/* <p className="inline-answer-container">Svar:</p> */}
                {props.questionnaireResource.map(
                    (qr) =>
                        qr.id ===
                            props.questionAndAnswer.questions.questions.options?.reference?.slice(
                                1,
                            ) &&
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
                                                  <div
                                                      className={setCount(
                                                          m.concept,
                                                      )}
                                                  >
                                                      {setContent(m.concept)}
                                                  </div>
                                              }
                                          >
                                              <a className="alternatives">
                                                  (Vis alternativer)
                                              </a>
                                          </Popover>
                                      ),
                              )
                            : null),
                )}
            </div>

            {props.questionAndAnswer.answers?.answers.answer?.map((item) => (
                <p
                    className="answers"
                    key={
                        item.valueCoding?.display
                            ? props.questionAndAnswer.answers?.id +
                              item.valueCoding.display
                            : props.questionAndAnswer.answers?.id
                    }
                >
                    {item.valueBoolean}
                    {item.valueCoding?.display}
                    {item.valueDate}
                    {item.valueDecimal}
                    {item.valueString}
                </p>
            ))}
        </div>
    );
};

export default QuestionsAndAnswersDisplay;
