import React from 'react';
import { IQuestionsAndAnswersDisplayProps } from '../QuestionsAndAnswersDisplay/QuestionsAndAnswersDisplay';
import { Popover, Button } from 'antd';
import '../Schemes.style.scss';

const SubQuestionsAndAnswersDisplay = (
    props: IQuestionsAndAnswersDisplayProps,
) => {
    const setContent = (data: fhir.ValueSetComposeIncludeConcept[]) => {
        if (data) {
            return data.map((line) => <li key={line.code}>{line.display}</li>);
        }
        return;
    };

    return (
        <>
            <div key={props.questionAndAnswerIndex}>
                <br></br>
                <p className="questions">
                    {props.questionAndAnswer.questions.questions.text}
                </p>
                <p className="inline-answer-container">Subspørsmål Svar:</p>
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
                                              content={setContent(m.concept)}
                                          >
                                              <Button
                                                  className="nopadding"
                                                  type="link"
                                              >
                                                  (Vis alternativer)
                                              </Button>
                                          </Popover>
                                      ),
                              )
                            : null),
                )}
                {props.questionAndAnswer.answers?.answers.answer?.map(
                    (item) => (
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
                    ),
                )}
            </div>
        </>
    );
};

export default SubQuestionsAndAnswersDisplay;
