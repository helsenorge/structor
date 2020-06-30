import React, { useContext, useState } from 'react';
import { Button, Tooltip, Row, Col, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
//import { convertQuestions } from '../../helpers/JSONConverter';
import { FormContext } from '../../store/FormStore';
import './NavBar.css';
import JSONQuestion from '../../types/JSONQuestion';
import JSONAnswer from '../../types/JSONAnswer';
import JSONConverter from '../../helpers/JSONGenerator';
import { Link } from 'react-router-dom';

function NavBar(): JSX.Element {
    const { state, dispatch } = useContext(FormContext);

    const { Title } = Typography;

    function convertQuestions() {
        const questionnaire = JSONConverter(
            state.sectionOrder,
            state.sections,
            state.questions,
        );
        console.log(questionnaire);
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
                            onClick={convertQuestions}
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
