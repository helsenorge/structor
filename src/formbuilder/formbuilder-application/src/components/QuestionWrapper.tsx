import React from 'react';
import * as DND from 'react-beautiful-dnd';
import { Row, Col, Button, Tooltip } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import QuestionBuilder from './QuestionBuilder';
import AnswerBuilder from './AnswerBuilder';

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
    return (
        <div>
            <Row>
                <Col span={3}>
                    <Button
                        style={{ zIndex: 1, color: 'var(--primary-1)' }}
                        icon={<CopyOutlined />}
                        type="default"
                        onClick={() => duplicateQuestion()}
                    >
                        Dupliser spørsmål
                    </Button>
                </Col>
                <Col span={3}>
                    <Button
                        style={{ zIndex: 1, color: 'var(--primary-1)' }}
                        icon={<DeleteOutlined />}
                        type="default"
                        onClick={() => removeQuestion()}
                    >
                        Slett spørsmål
                    </Button>
                </Col>
                <Col span={1}>
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
                <QuestionBuilder questionId={questionId}></QuestionBuilder>
            </Row>
            <Row>
                <AnswerBuilder questionId={questionId}></AnswerBuilder>
            </Row>
        </div>
    );
}

export default QuestionWrapper;
