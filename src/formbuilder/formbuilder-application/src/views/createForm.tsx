import React from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/formBuilder/NavBar';
import Section from '../components/formBuilder/Section';

function CreateForm(): JSX.Element {
    return (
        <div style={{ backgroundColor: '#C7C7C7', height: '100vh' }}>
            <Row style={{ height: '56px' }}>
                <Col span="24">
                    <NavBar></NavBar>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <Section></Section>
                </Col>
            </Row>
        </div>
    );
}

export default CreateForm;
