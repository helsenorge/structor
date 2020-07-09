import React, { useState, useContext } from 'react';
import * as DND from 'react-beautiful-dnd';
import { Row, Col, Button, Tooltip, Modal } from 'antd';
import {
    DeleteOutlined,
    CopyOutlined,
    EyeOutlined,
    UpOutlined,
    DownOutlined,
} from '@ant-design/icons';
import QuestionBuilder from './QuestionBuilder';
import AnswerBuilder from './AnswerBuilder';
import JSONGenerator from '../helpers/JSONGenerator';
import { FormContext, updateQuestion } from '../store/FormStore';
import ISection from '../types/ISection';
import SectionList from '../types/SectionList';
import QuestionList from '../types/QuestionList';
import AnswerTypes from '../types/IAnswer';
import IQuestion from '../types/IQuestion';

type QuestionProps = {
    duplicateQuestion: () => void;
    questionId: string;
    cronologicalID: Array<number>;
    removeQuestion: () => void;
    provided: DND.DraggableProvided;
    isInfo: boolean;
};

function QuestionWrapper({
    duplicateQuestion,
    questionId,
    cronologicalID,
    removeQuestion,
    provided,
    isInfo,
}: QuestionProps): JSX.Element {
    const [questionPreview, setQuestionPreview] = useState(false);
    const { state, dispatch } = useContext(FormContext);

    function localUpdate(attribute: { collapsed: boolean }) {
        const temp = { ...state.questions[questionId] };
        temp.collapsed = attribute.collapsed;
        dispatch(updateQuestion(temp));
    }

    function collapseButton(collapsed: boolean) {
        const collapseButton = document.getElementById(
            'CollapseQuestionButton',
        );
        if (collapseButton) {
            collapseButton.focus();
        }

        localUpdate({ collapsed: collapsed });
    }

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
                    showFooter: false,
                },
                '*',
            );
        }
    }

    return (
        <div style={{ marginTop: '10px' }}>
            <Modal
                title={
                    'Slik ser ' +
                    (isInfo ? 'informasjonen' : 'spørsmålet') +
                    ' ut for utfyller'
                }
                visible={questionPreview}
                onOk={() => setQuestionPreview(false)}
                destroyOnClose={true}
                width="90vw"
                style={{ top: '10px' }}
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
                        title="Forhåndsvis spørsmål"
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
                <Col span={2} style={{ display: 'block' }}>
                    <Tooltip
                        title={
                            (state.questions[questionId] as IQuestion).collapsed
                                ? 'Utvid ' +
                                  (isInfo ? 'informasjon' : 'spørsmål')
                                : 'Kollaps ' +
                                  (isInfo ? 'informasjon' : 'spørsmål')
                        }
                    >
                        <Button
                            id="CollapseQuestionButton"
                            style={{
                                zIndex: 1,
                                marginLeft: '10px',
                                color: 'var(--primary-1)',
                                float: 'left',
                            }}
                            size="small"
                            type="link"
                            shape="circle"
                            icon={
                                (state.questions[questionId] as IQuestion)
                                    .collapsed ? (
                                    <DownOutlined />
                                ) : (
                                    <UpOutlined />
                                )
                            }
                            onClick={() =>
                                collapseButton(
                                    !(state.questions[questionId] as IQuestion)
                                        .collapsed,
                                )
                            }
                        />
                    </Tooltip>
                </Col>
                <Col span={22} style={{ display: 'block' }}>
                    {((state.questions[questionId].questionText.length > 0 &&
                        state.questions[questionId].answerType !==
                            AnswerTypes.default) ||
                        state.questions[questionId].answerType ===
                            AnswerTypes.info) && (
                        <Button
                            style={{
                                zIndex: 1,
                                color: 'var(--primary-1)',
                                marginLeft: '10px',
                                float: 'left',
                            }}
                            icon={<EyeOutlined />}
                            type="default"
                            onClick={() => setQuestionPreview(true)}
                        >
                            Forhåndsvis {isInfo ? 'informasjon' : 'spørsmål'}
                        </Button>
                    )}
                    <Tooltip
                        title={isInfo ? 'Flytt informasjon' : 'Flytt spørsmål'}
                    >
                        <Button
                            id="MoveButton"
                            style={{
                                zIndex: 1,
                                color: 'var(--primary-1)',
                                float: 'right',
                            }}
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
                    <Button
                        style={{
                            zIndex: 1,
                            color: 'var(--primary-1)',
                            marginLeft: '10px',
                            float: 'right',
                        }}
                        icon={<DeleteOutlined />}
                        type="default"
                        onClick={() => removeQuestion()}
                    >
                        Slett {isInfo ? 'informasjon' : 'spørsmål'}
                    </Button>
                    <Button
                        style={{
                            zIndex: 1,
                            color: 'var(--primary-1)',
                            marginLeft: '10px',
                            float: 'right',
                        }}
                        icon={<CopyOutlined />}
                        type="default"
                        onClick={() => duplicateQuestion()}
                    >
                        Dupliser {isInfo ? 'informasjon' : 'spørsmål'}
                    </Button>
                </Col>
            </Row>
            {!isInfo && (
                <Row>
                    <Col span={4} style={{ float: 'left' }}>
                        {String(cronologicalID.map((a) => a + 1))}
                    </Col>
                    <Col xl={16} md={18}>
                        <QuestionBuilder
                            questionId={questionId}
                        ></QuestionBuilder>
                    </Col>
                </Row>
            )}
            {!state.questions[questionId].collapsed && (
                <Row>
                    <Col span={4} style={{ float: 'left' }}>
                        {isInfo && String(cronologicalID.map((a) => a + 1))}
                    </Col>
                    <Col xl={16} md={20}>
                        <AnswerBuilder questionId={questionId}></AnswerBuilder>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default QuestionWrapper;
