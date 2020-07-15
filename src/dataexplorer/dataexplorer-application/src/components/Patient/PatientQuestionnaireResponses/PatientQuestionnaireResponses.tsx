import React, { useContext } from 'react';
import { Row, Spin } from 'antd';
import PatientView from './PatientQuestionnaire/PatientView/PatientView';
import PatientQuestionnaire from './PatientQuestionnaire/PatientQuestionnaire';
import { PatientContext } from '../PatientContext';

const PatientQuestionnaireResponses = () => {
    const { questionnaireResponse: questionnaireResponses, questionnaire } = useContext(PatientContext);
    return (
        <>
            {questionnaireResponses.entry !== undefined && questionnaire.entry !== undefined && (
                <PatientQuestionnaire />
            )}
            {/* Patients without QuestionnaireResponses do not need to fetch for Questionnaires*/}
            {questionnaireResponses && questionnaireResponses.total === 0 && (
                <PatientView dataSource={[]} hasQuestionnaireResponses={false} />
            )}
            {!questionnaireResponses && (
                <Row justify="center">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientQuestionnaireResponses;
