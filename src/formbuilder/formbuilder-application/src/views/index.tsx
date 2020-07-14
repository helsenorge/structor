import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';
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
import { useHistory } from 'react-router-dom';

function Index(): JSX.Element {
    const history = useHistory();

    const { dispatch } = useContext(FormContext);
    function reuploadJSONFile(questionnaireObj: fhir.Questionnaire) {
        dispatch(clearAllSections());
        const oldJSON: {
            formMeta: { title: string; description?: string };
            sections: Array<ISection>;
            questions: Array<IQuestion>;
        } = convertFromJSON(questionnaireObj);
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

    function createNewForm() {
        dispatch(clearAllSections());
        dispatch(addNewSection());
        dispatch(updateFormMeta('', ''));
        history.push('/create-form');
    }

    function onChange(event: any) {
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event: any) {
        const obj = JSON.parse(event.target.result);
        reuploadJSONFile(obj);
        history.push('/create-form');
    }

    return (
        <Row align="middle" justify="center" style={{ backgroundColor: 'var(--primary-2)', height: '100vh' }}>
            <Col
                xl={8}
                lg={10}
                md={10}
                sm={15}
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
                                    <label className="index-buttons" onClick={createNewForm}>
                                        <EditOutlined style={{ paddingRight: '5px' }} />
                                        Lag nytt skjema
                                    </label>
                                </div>
                            </Col>
                            <Col span={12}>
                                <label className="index-buttons">
                                    <input type="file" style={{ display: 'none' }} onChange={onChange} />
                                    <UploadOutlined style={{ paddingRight: '5px' }} />
                                    Last opp JSON-fil
                                </label>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Index;
