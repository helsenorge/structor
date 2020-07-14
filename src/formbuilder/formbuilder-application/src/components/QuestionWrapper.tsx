import React, { useState, useContext } from 'react';
import * as DND from 'react-beautiful-dnd';
import { Row, Col, Button, Tooltip, Modal, Popconfirm, Popover } from 'antd';
import { DeleteOutlined, CopyOutlined, EyeOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import QuestionBuilder from './QuestionBuilder';
import AnswerBuilder from './AnswerBuilder';
import JSONGenerator from '../helpers/JSONGenerator';
import { FormContext, updateQuestion } from '../store/FormStore';
import ISection from '../types/ISection';
import SectionList from '../types/SectionList';
import QuestionList from '../types/QuestionList';
import { IInfo } from '../types/IAnswer';
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
    const previewWarning = (
        <div>
            <p>
                Spørsmålet er ikke ferdig utfylt. <br />
                Fyll inn spørsmålstekst og røde felt.
            </p>
        </div>
    );

    function updateStore(attribute: { collapsed: boolean }) {
        const temp = { ...state.questions[questionId] };
        temp.collapsed = attribute.collapsed;
        dispatch(updateQuestion(temp));
    }

    function collapseButton(collapsed: boolean) {
        const collapseButton = document.getElementById('CollapseQuestionButton');
        if (collapseButton) {
            collapseButton.focus();
        }

        updateStore({ collapsed: collapsed });
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
        const tempQuestionList: QuestionList = {
            [questionId]: state.questions[questionId],
        };
        const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
            input !== null && input.tagName === 'IFRAME';

        const questionnaireString = JSON.stringify(
            JSONGenerator('', '', [tempSection.id], tempSectionList, tempQuestionList),
        );

        const schemeDisplayer = document.getElementById('schemeFrame');
        if (isIFrame(schemeDisplayer) && schemeDisplayer.contentWindow) {
            console.log('Fant frame');
            console.log(questionnaireString);
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

    function buttons(): JSX.Element {
        return (
            <>
                <Row style={{ float: 'right', paddingTop: '10px' }}>
                    <Popconfirm
                        title={isInfo ? 'Vil du slette informasjonsfeltet?' : 'Vil du slette dette spørsmålet?'}
                        onConfirm={() => removeQuestion()}
                        okText="Ja"
                        cancelText="Nei"
                    >
                        <Button
                            style={{
                                zIndex: 1,
                                color: 'var(--primary-1)',
                                marginLeft: '10px',
                                float: 'right',
                                width: '125px',
                            }}
                            icon={<DeleteOutlined />}
                            type="default"
                        >
                            Slett
                        </Button>
                    </Popconfirm>
                </Row>
                <Row style={{ float: 'right', paddingTop: '10px' }}>
                    <Button
                        style={{
                            zIndex: 1,
                            color: 'var(--primary-1)',
                            marginLeft: '10px',
                            float: 'right',
                            width: '125px',
                        }}
                        icon={<CopyOutlined />}
                        type="default"
                        onClick={() => duplicateQuestion()}
                    >
                        Dupliser
                    </Button>
                </Row>
                <Row style={{ float: 'right', paddingTop: '10px' }}>
                    {!(
                        // (state.questions[questionId].questionText.length > 0 &&
                        //     state.questions[questionId].answerType !== AnswerTypes.default) ||
                        // (state.questions[questionId].answerType === AnswerTypes.info &&
                        //
                        state.questions[questionId].answer.valid /* && state.questions[questionId].valid */
                    ) ? (
                        <Popover
                            content={!isInfo ? previewWarning : 'Fyll inn informasjonsfeltet.'}
                            title="Ingenting å forhåndsvise"
                            placement="bottom"
                        >
                            <Button
                                style={{
                                    zIndex: 1,
                                    color: 'var(--primary-1)',
                                    marginLeft: '10px',
                                    float: 'left',
                                    width: '125px',
                                }}
                                icon={<EyeOutlined />}
                                type="default"
                                disabled
                            >
                                Forhåndsvis
                            </Button>
                        </Popover>
                    ) : (
                        <Button
                            style={{
                                zIndex: 1,
                                color: 'var(--primary-1)',
                                marginLeft: '10px',
                                float: 'left',
                                width: '125px',
                            }}
                            icon={<EyeOutlined />}
                            type="default"
                            onClick={() => setQuestionPreview(true)}
                        >
                            Forhåndsvis
                        </Button>
                    )}
                </Row>
            </>
        );
    }

    function getCollapsedInfoText(): JSX.Element {
        const collapsedInfoText = (state.questions[questionId].answer as IInfo).info;
        if ((state.questions[questionId].answer as IInfo).info.length > 130)
            return (
                <p style={{ float: 'left', padding: '5px', fontStyle: 'italic' }}>
                    {collapsedInfoText.substring(0, 130) + '...'}
                </p>
            );
        return <p style={{ float: 'left', padding: '5px', fontStyle: 'italic' }}> {collapsedInfoText} </p>;
    }

    return (
        <div
            style={{
                marginTop: '10px',
                backgroundColor: 'var(--color-base-1)',
                padding: '30px',
            }}
        >
            <Modal
                title={'Slik ser ' + (isInfo ? 'informasjonen' : 'spørsmålet') + ' ut for utfyller'}
                visible={questionPreview}
                onOk={() => setQuestionPreview(false)}
                destroyOnClose={true}
                width="90vw"
                style={{ top: '10px' }}
                footer={[
                    <Button key="submit" type="primary" onClick={() => setQuestionPreview(false)}>
                        Lukk
                    </Button>,
                ]}
                onCancel={() => setQuestionPreview(false)}
            >
                <div style={{ height: '100%', width: '100%' }} className="iframe-div">
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
            <Row>
                <Col span={1} style={{ display: 'block' }}>
                    <Tooltip
                        title={
                            (state.questions[questionId] as IQuestion).collapsed
                                ? 'Utvid ' + (isInfo ? 'informasjon' : 'spørsmål')
                                : 'Minimer ' + (isInfo ? 'informasjon' : 'spørsmål')
                        }
                    >
                        <Button
                            id="stealFocus"
                            style={{
                                zIndex: 1,
                                color: 'grey',
                                float: 'left',
                            }}
                            type="link"
                            shape="circle"
                            icon={
                                (state.questions[questionId] as IQuestion).collapsed ? <DownOutlined /> : <UpOutlined />
                            }
                            onClick={() => collapseButton(!(state.questions[questionId] as IQuestion).collapsed)}
                        />
                    </Tooltip>
                </Col>
                {!isInfo && (
                    <>
                        <Col sm={0} lg={2}></Col>
                        <Col span={1} style={{ padding: '5px 10px' }}>
                            <h4 style={{ float: 'right', color: 'grey' }}>
                                {String(cronologicalID.map((a) => a + 1))}
                            </h4>
                        </Col>
                        <Col lg={20} sm={22} style={{ width: '100%' }}>
                            <QuestionBuilder
                                questionId={questionId}
                                buttons={buttons}
                                provided={provided}
                                isInfo={isInfo}
                            ></QuestionBuilder>
                        </Col>
                    </>
                )}
                {isInfo && (
                    <>
                        <Col span={3} style={{ padding: '5px 10px' }}>
                            <h4 style={{ float: 'right', color: 'grey' }}>
                                {String(cronologicalID.map((a) => a + 1))}
                            </h4>
                        </Col>
                        {!state.questions[questionId].collapsed ? (
                            <Col sm={13} lg={14}>
                                <AnswerBuilder questionId={questionId}></AnswerBuilder>
                            </Col>
                        ) : (
                            <Col lg={16} sm={22} style={{ width: '100%' }}>
                                {(state.questions[questionId].answer as IInfo).info ? (
                                    getCollapsedInfoText()
                                ) : (
                                    <p style={{ float: 'left', padding: '5px' }}>Tomt informasjonsfelt</p>
                                )}
                            </Col>
                        )}
                        <Col lg={2} sm={0} />
                        <Col sm={7} lg={4}>
                            <Row style={{ float: 'right' }}>
                                <Tooltip title={isInfo ? 'Flytt informasjon' : 'Flytt spørsmål'}>
                                    <Button
                                        id={'stealFocus_' + questionId}
                                        style={{
                                            zIndex: 1,
                                            color: 'var(--primary-1)',
                                            float: 'right',
                                        }}
                                        type="link"
                                        shape="circle"
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
                            </Row>
                            {!state.questions[questionId].collapsed && buttons()}
                        </Col>
                    </>
                )}
            </Row>

            {!state.questions[questionId].collapsed && (
                <Row>
                    <Col sm={1} lg={4}></Col>
                    <Col
                        sm={21}
                        lg={14}
                        style={{
                            float: 'left',
                            textAlign: 'left',
                            padding: '0 10px 10px 10px',
                            marginTop: '0',
                        }}
                    >
                        {!isInfo && <AnswerBuilder questionId={questionId}></AnswerBuilder>}
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default QuestionWrapper;
