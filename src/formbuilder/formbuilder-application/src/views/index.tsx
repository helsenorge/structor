import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import convertFromJSON from '../helpers/FromJSONToForm';

function Index(): JSX.Element {
    return (
        <Row
            align="middle"
            justify="center"
            style={{ backgroundColor: 'var(--primary-2)', height: '100vh' }}
        >
            <Col
                span={8}
                style={{
                    backgroundColor: 'var(--color-base-1)',
                    height: '33vh',
                    boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
                }}
            >
                <Row align="middle" justify="center" style={{ height: '100%' }}>
                    <Col>
                        <Row gutter={[10, 48]}>
                            <Col>
                                <h1> Velkommen til skjemabyggeren</h1>
                            </Col>
                        </Row>
                        <Row align="middle" justify="center">
                            <Col span={12}>
                                <div
                                    style={{
                                        display: 'inline-block',
                                        alignContent: 'center',
                                    }}
                                >
                                    <Link to="create-form">
                                        <Button
                                            style={{
                                                backgroundColor:
                                                    'var(--primary-1)',
                                                color: 'var(--color-base-1)',
                                            }}
                                        >
                                            Lag nytt skjema
                                        </Button>
                                    </Link>
                                </div>
                            </Col>
                            <Col span={12}>
                                <Button
                                    style={{
                                        backgroundColor: 'var(--primary-1)',
                                        color: 'var(--color-base-1)',
                                    }}
                                    onClick={convertFromJSON}
                                >
                                    Last opp JSON-fil
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Index;
