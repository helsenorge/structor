import React from 'react';
import { Col, Row } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

function CreateForm(): JSX.Element {
    return (
        <Row justify="center" align="middle" style={{ height: '100vh' }}>
            <Col span={8}>
                <h1>Overskrift</h1>
            </Col>
        </Row>
    );
}

export default CreateForm;
