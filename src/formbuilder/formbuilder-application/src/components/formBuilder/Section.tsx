import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import InputField from '../questionComponent/InputField';
import { PlusOutlined, MoreOutlined, DeleteOutlined } from '@ant-design/icons';

type SectionProps = {
    id: number;
    removeSection: () => void;
};

function Section({ id, removeSection }: SectionProps): JSX.Element {
    const [placeholder, setPlaceholder] = useState('Tittel...');
    const [isSection, setIsSection] = useState(false);

    function findPlaceholder() {
        if (id === 0) {
            setIsSection(false);
            setPlaceholder('Tittel...');
            return;
        }
        setIsSection(true);
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
                display: 'inline-block',
            }}
        >
            <Row>
                <Col span={22}>
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
                <Col span={2}>
                    {isSection && (
                        <Button
                            style={{ zIndex: 1, color: 'var(--primary-1)' }}
                            size="large"
                            icon={<DeleteOutlined />}
                            type="link"
                            onClick={() => removeSection()}
                        />
                    )}
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
