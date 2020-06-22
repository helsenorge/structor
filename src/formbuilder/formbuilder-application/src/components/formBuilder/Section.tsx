import React from 'react';
import { Row, Col, Button } from 'antd';
import TitleInput from '../questionComponent/TitleInput';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';

function Section(): JSX.Element {
    return (
        <div
            style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: '#FAFAFA',
                width: '95%',
            }}
        >
            <Row>
                <Col span={24}>
                    <div style={{ display: 'inline' }}>
                        <TitleInput></TitleInput>
                    </div>
                    <div style={{ display: 'inline' }}>
                        <Button
                            type="link"
                            shape="circle"
                            style={{ color: '#A61E7B' }}
                            icon={<MoreOutlined />}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Button
                        type="primary"
                        shape="circle"
                        style={{
                            backgroundColor: '#A61E7B',
                            borderColor: '#A61E7B',
                        }}
                        icon={<PlusOutlined />}
                        size="large"
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Section;
