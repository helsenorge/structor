import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip, Row, Col, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Container from '../../skjemautfyller/container';
import './NavBar.css';

const { Title } = Typography;

function NavBar(): JSX.Element {
    function formPreview() {
        return <Container />;
    }
    return (
        <div className="nav-bar">
            <Row>
                <Col span={1}>
                    <Tooltip title="Tilbake">
                        <Button
                            style={{
                                margin: '5px',
                                float: 'left',
                                color: 'var(--color-base-1)',
                            }}
                            type="link"
                            shape="circle"
                            icon={<LeftOutlined />}
                            onClick={() => window.history.back()}
                        />
                    </Tooltip>
                </Col>
                <Col span={17}>
                    <Title
                        level={2}
                        style={{ color: 'var(--color-base-1)', float: 'left' }}
                    >
                        Skjemabygger
                    </Title>
                </Col>
                <Col span={6}>
                    <div style={{ float: 'right' }}>
                        <Link to="preview">
                            <Button
                                className="nav-button"
                                type="link"
                                size="large"
                                style={{ margin: '2px' }}
                                key="previewForm"
                                onClick={formPreview}
                            >
                                Forhåndsvisning
                            </Button>
                        </Link>
                        <Button
                            className="nav-button"
                            type="link"
                            size="large"
                            style={{ margin: '2px 10px' }}
                            key="saveForm"
                        >
                            Lagre
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default NavBar;
