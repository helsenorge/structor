import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Button, Tooltip } from 'antd';
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import './QuestionComponents.css';
import AnswerComponent from '../answerComponent/AnswerComponent';
const { TextArea } = Input;

type QuestionProps ={
    id: number;
    removeQuestion: ()=> void;
}

function Question({id, removeQuestion}:QuestionProps){
    const [placeholder, setPlaceholder] = useState('Spørsmål 1...');
    useEffect(() => {
        findPlaceholder();
    });
    function findPlaceholder(){
        console.log(id+1);
        setPlaceholder('Spørsmål ' + (id+1) + '...');
    }
    return (
        <div>
            <Row>
                <Col span={23}>
                    <Row>
                        <Col span={23}>
                            <div style={{ display: 'inline' }}>
                                <div
                                    style={{
                                        width: '60%',
                                        display: 'inline-block',
                                        padding: '5px',
                                    }}
                                >
                                    <TextArea
                                        rows={1}
                                        placeholder={placeholder} 
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col>
                        <Tooltip title="Slett spørsmål">
                    <Button 
                        style={{zIndex: 1, color:'var(--primary-1)'}}  
                        icon={<DeleteOutlined/>} 
                        type="link" 
                        onClick={()=>removeQuestion()}/> 
                        </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={23}>
                            <div style={{ display: 'inline' }}>
                                <div
                                    style={{
                                        width: '60%',
                                        display: 'inline-block',
                                        padding: '5px',
                                    }}
                                >
                                    <TextArea
                                        rows={4}
                                        placeholder="Forklarende tekst....."
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <AnswerComponent/>
                </Col>
                <Col span={1}>
                    <div style={{ display: 'inline' }}>
                        <Button
                            type="link"
                            shape="circle"
                            style={{ color: 'var(--primary-1)' }}
                            icon={<MoreOutlined />}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Question;
