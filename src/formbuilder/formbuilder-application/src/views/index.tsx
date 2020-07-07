import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import convertFromJSON from '../helpers/FromJSONToForm';
import ISection from '../types/ISection';
import IQuestion from '../types/IQuestion';
import {
    updateQuestion,
    updateAnswer,
    FormContext,
    addNewSection,
    clearAllSections,
    updateFormMeta,
} from '../store/FormStore';

function Index(): JSX.Element {
    const { dispatch } = useContext(FormContext);
    function reuploadJSONFile() {
        dispatch(clearAllSections());
        const oldJSON: {
            formMeta: { title: string; description?: string };
            sections: Array<ISection>;
            questions: Array<IQuestion>;
        } = convertFromJSON();
        const sections = oldJSON.sections;
        const questions = oldJSON.questions;
        const formTitle = oldJSON.formMeta.title;
        const formDesc = oldJSON.formMeta.description;

        dispatch(updateFormMeta(formTitle, formDesc));

        for (let i = 0; i < sections.length; i++) {
            dispatch(addNewSection(sections[i]));
        }

        for (let i = 0; i < questions.length; i++) {
            dispatch(updateQuestion(questions[i]));
            if (questions[i].answer !== undefined) {
                dispatch(updateAnswer(questions[i].id, questions[i].answer));
            }
        }
    }
    return (
        <Row
            align="middle"
            justify="center"
            style={{ backgroundColor: 'var(--primary-2)', height: '100vh' }}
        >
            <Col
                span={8}
                style={{
                    backgroundColor: 'var(--color-base-1)',
                    height: '33vh',
                    boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
                }}
            >
                <Row align="middle" justify="center" style={{ height: '100%' }}>
                    <Col>
                        <Row gutter={[10, 48]}>
                            <Col>
                                <h1> Velkommen til skjemabyggeren</h1>
                            </Col>
                        </Row>
                        <Row align="middle" justify="center">
                            <Col span={12}>
                                <div
                                    style={{
                                        display: 'inline-block',
                                        alignContent: 'center',
                                    }}
                                >
                                    <Link to="create-form">
                                        <Button
                                            style={{
                                                backgroundColor:
                                                    'var(--primary-1)',
                                                color: 'var(--color-base-1)',
                                            }}
                                        >
                                            Lag nytt skjema
                                        </Button>
                                    </Link>
                                </div>
                            </Col>
                            <Col span={12}>
                                <Link to="create-form">
                                    <Button
                                        style={{
                                            backgroundColor: 'var(--primary-1)',
                                            color: 'var(--color-base-1)',
                                        }}
                                        onClick={reuploadJSONFile}
                                    >
                                        Last opp JSON-fil
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Index;
