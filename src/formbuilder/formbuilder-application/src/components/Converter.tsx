import React, { useEffect, useContext, useState } from 'react';
import { Row, Col } from 'antd';
import {
    FormContext,
} from '../store/FormStore';

function Converter(): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const questionnaire = {};
    const [valueSetObj, setValueSetObj] = useState([{}]);
    const [questionObj, setQuestionObj] = useState([{}]);
    useEffect(() => {
        convertQuestions();
    });

    function convertQuestions() {
        for (const key in state.questions) {
            console.log("Converter: ", key, state.questions[key]);
          }
    }
    return (
        <div className="nav-bar">
            <Row>
                <Col span={1}>
                    <h1>Converter</h1>
                </Col>
            </Row>
        </div>
    );
}

export default Converter;
