import React, { useContext, useState } from 'react';
import { Input, Row, Col } from 'antd';
import { FormContext, updateFormMeta } from '../store/FormStore';

const { TextArea } = Input;

function TitleAndDescription(): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [title, setTitle] = useState(state.title);
    const [description, setDescription] = useState(state.description);

    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: 'var(--primary-2)',
            }}
            className="wrapper"
        >
            <Row style={{ padding: '10px' }}>
                <Col xs={0} lg={4}></Col>
                <Col xs={24} lg={16}>
                    <Input
                        placeholder="Skjematittel..."
                        className="input-question"
                        size="large"
                        defaultValue={title}
                        onBlur={(e) => {
                            setTitle(e.currentTarget.value);
                            dispatch(updateFormMeta(e.currentTarget.value, description));
                        }}
                    ></Input>
                </Col>
                <Col xs={0} lg={4}></Col>
            </Row>
            <Row style={{ padding: '0 10px 10px 10px' }}>
                <Col xs={0} lg={4}></Col>
                <Col xs={24} lg={16}>
                    <TextArea
                        placeholder="Beskrivelse av skjema..."
                        className="input-question"
                        defaultValue={description}
                        onBlur={(e) => {
                            setDescription(e.currentTarget.value);
                            dispatch(updateFormMeta(title, e.currentTarget.value));
                        }}
                    ></TextArea>
                </Col>
                <Col xs={0} lg={4}></Col>
            </Row>
        </div>
    );
}
export default TitleAndDescription;
