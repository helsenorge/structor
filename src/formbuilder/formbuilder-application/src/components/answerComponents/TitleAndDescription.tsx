import React, { useState } from 'react';
import { Input, Row, Col, Checkbox } from 'antd';
import './AnswerComponent.css';

function TitleAndDescription(): JSX.Element {
    const [desc, setDescState] = useState(true);
    return (
        <div
            style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: 'var(--color-base-1)',
                width: '95%',
                display: 'inline-block',
            }}
        >
            <Row>
                <Col xs={0} lg={4}></Col>
                <Col xs={24} lg={16}>
                <Input
                    placeholder="Skjematittel..."
                    className="input-question"
                ></Input>
                </Col>
                <Col xs={0} lg={4}></Col>
            </Row>
            <Row>
            <Col xs={0} lg={4}></Col>
                <Col xs={20} lg={12}>
                    <Input
                        placeholder="Beskrivelse av skjema..."
                        className="input-question"
                        disabled={!desc}
                    ></Input>
                </Col>
                <Col span={4} style={{ padding: '0 10px' }}>
                    <Checkbox defaultChecked onChange={(e) => setDescState(e.target.checked)}>
                        Ta med beskrivelse av skjema
                    </Checkbox>
                    </Col>
                <Col xs={0} lg={4}></Col>
            </Row>
        </div>
    );
}
export default TitleAndDescription;
