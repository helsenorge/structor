import React, { useContext, useState, useEffect } from 'react';
import { Input, Row, Col } from 'antd';
import { FormContext, updateFormMeta } from '../store/FormStore';

const { TextArea } = Input;

function TitleAndDescription(): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [validationList, setValidationList] = useState([false, false]);
    const [visitedfields, setVisitedField] = useState([false, false]);
    const [title, setTitle] = useState(state.title);
    const [description, setDescription] = useState(state.description);

    function validate(field: number, value: string): void {
        const tempValid = [...validationList];
        const tempVisited = [...visitedfields];
        value.length > 0 ? (tempValid[field] = true) : (tempValid[field] = false);
        tempVisited[field] = true;
        setVisitedField(tempVisited);
        setValidationList(tempValid);
    }

    function showError(field: number): boolean {
        return (state.validationFlag && !validationList[field]) || (!validationList[field] && visitedfields[field]);
    }

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
                        className={showError(0) ? 'field-error' : 'input-question'}
                        size="large"
                        defaultValue={title}
                        onBlur={(e) => {
                            setTitle(e.currentTarget.value);
                            dispatch(updateFormMeta(e.currentTarget.value, description));
                            validate(0, e.currentTarget.value);
                        }}
                    ></Input>
                    {showError(0) && <p style={{ color: 'red' }}> Fyll inn skjema tittel</p>}
                </Col>
                <Col xs={0} lg={4}></Col>
            </Row>
            <Row style={{ padding: '0 10px 10px 10px' }}>
                <Col xs={0} lg={4}></Col>
                <Col xs={24} lg={16}>
                    <TextArea
                        placeholder="Beskrivelse av skjema..."
                        className={showError(1) ? 'field-error' : 'input-question'}
                        defaultValue={description}
                        onBlur={(e) => {
                            setDescription(e.currentTarget.value);
                            dispatch(updateFormMeta(title, e.currentTarget.value));
                            validate(1, e.currentTarget.value);
                        }}
                    ></TextArea>
                    {showError(1) && <p style={{ color: 'red' }}> Fyll inn skjema beskrivelse</p>}
                </Col>
                <Col xs={0} lg={4}></Col>
            </Row>
        </div>
    );
}
export default TitleAndDescription;
