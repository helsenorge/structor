import React, { useState, useContext } from 'react';
import * as DND from 'react-beautiful-dnd';
import { Row, Col, Button, Tooltip, Modal } from 'antd';
import { DeleteOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons';
import QuestionBuilder from './QuestionBuilder';
import AnswerBuilder from './AnswerBuilder';
import JSONGenerator from '../helpers/JSONGenerator';
import { FormContext } from '../store/FormStore';
import ISection from '../types/ISection';
import SectionList from '../types/SectionList';
import QuestionList from '../types/QuestionList';

type QuestionProps = {
    duplicateQuestion: () => void;
    questionId: string;
    removeQuestion: () => void;
    provided: DND.DraggableProvided;
};

function QuestionWrapper({
    duplicateQuestion,
    questionId,
    removeQuestion,
    provided,
}: QuestionProps): JSX.Element {
    const [questionPreview, setQuestionPreview] = useState(false);
    const { state } = useContext(FormContext);

    function iFrameLoaded() {
        const tempSection: ISection = {
            id: 'PreviewSection',
            questionOrder: [questionId],
            sectionTitle: '',
            description: '',
        };
        const tempSectionList: SectionList = {
            [tempSection.id]: tempSection as ISection,
        };
        const fakeQuestionList: QuestionList = {
            [questionId]: state.questions[questionId],
        };
        const isIFrame = (
            input: HTMLElement | null,
        ): input is HTMLIFrameElement =>
            input !== null && input.tagName === 'IFRAME';

        const questionnaireString = JSON.stringify(
            JSONGenerator(
                '',
                '',
                [tempSection.id],
                tempSectionList,
                fakeQuestionList,
            ),
        );

        const schemeDisplayer = document.getElementById('schemeFrame');
        if (isIFrame(schemeDisplayer) && schemeDisplayer.contentWindow) {
            console.log('Fant frame');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schemeDisplayer.contentWindow.postMessage(
                {
                    questionnaireString: questionnaireString,
                },
                '*',
            );
        }
    }

    return (
        <div style={{ marginTop: '10px' }}>
            <Modal
                title="Slik ser spørsmålet ut for utfyller"
                visible={questionPreview}
                onOk={() => setQuestionPreview(false)}
                destroyOnClose={true}
                width="90vw"
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => setQuestionPreview(false)}
                    >
                        Lukk
                    </Button>,
                ]}
                onCancel={() => setQuestionPreview(false)}
            >
                <div style={{ height: '100%', width: '100%' }}>
                    <iframe
                        id="schemeFrame"
                        style={{
                            width: '100%',
                            height: '70vh',
                        }}
                        onLoad={iFrameLoaded}
                        src="../../iframe/index.html"
                    ></iframe>
                </div>
            </Modal>
            <Row justify="end">
                <Col
                    sm={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                    <Button
                        style={{
                            zIndex: 1,
                            color: 'var(--primary-1)',
                            marginLeft: '10px',
                        }}
                        icon={<CopyOutlined />}
                        type="default"
                        onClick={() => duplicateQuestion()}
                    >
                        Dupliser spørsmål
                    </Button>
                    <Button
                        style={{
                            zIndex: 1,
                            color: 'var(--primary-1)',
                            marginLeft: '10px',
                        }}
                        icon={<DeleteOutlined />}
                        type="default"
                        onClick={() => removeQuestion()}
                    >
                        Slett spørsmål
                    </Button>
                    <Button
                        style={{
                            zIndex: 1,
                            color: 'var(--primary-1)',
                            marginLeft: '10px',
                        }}
                        icon={<EyeOutlined />}
                        type="default"
                        onClick={() => setQuestionPreview(true)}
                    >
                        Forhåndsvis som utfyller
                    </Button>
                    <Tooltip title="Flytt spørsmål">
                        <Button
                            style={{ zIndex: 1, color: 'var(--primary-1)' }}
                            size="large"
                            type="link"
                            {...provided.dragHandleProps}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path
                                    fill="var(--primary-1)"
                                    d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"
                                />
                            </svg>
                        </Button>
                    </Tooltip>
                </Col>
            </Row>
            <Row>
                <Col span={4}></Col>
                <Col xl={16} md={20}>
                    <QuestionBuilder questionId={questionId}></QuestionBuilder>
                </Col>
            </Row>
            <Row>
                <Col span={4}></Col>
                <Col xl={16} md={20}>
                    <AnswerBuilder questionId={questionId}></AnswerBuilder>
                </Col>
            </Row>
        </div>
    );
}

export default QuestionWrapper;
