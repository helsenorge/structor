import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import InputField from '../questionComponent/InputField';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';

type SectionProps = {
    id: number;
}

function Section({id}:SectionProps) {
    const [placeholder, setPlaceholder] = useState('Tittel...');
    function findPlaceholder(){
        if (id == 0){
            setPlaceholder('Tittel...');
            return;
        } 
        setPlaceholder('Seksjonstittel...');
    }

    useEffect(() => {
        findPlaceholder();
    });

    return (
        <div
            style={{
                margin: '10px',
                padding: '10px',
                backgroundColor: 'var(--color-base-1)',
                width: '95%',
                display: 'inline-block'
            }}
        >
            <Row>
                <Col span={24}>
                    <div style={{ display: 'inline' }}>
                        <InputField placeholder={placeholder} />
                    </div>
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
            <Row>
                <Col span={24}>
                    <Button
                        type="primary"
                        shape="circle"
                        style={{
                            backgroundColor: 'var(--primary-1)',
                            borderColor: 'var(--primary-1)',
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
