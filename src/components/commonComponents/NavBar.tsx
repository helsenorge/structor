import React, { useContext, useState } from 'react';
import { Button, Tooltip, Row, Col, Typography, Modal, message } from 'antd';
import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { FormContext } from '../../store/FormStore';
import './NavBar.css';
import JSONConverter from '../../helpers/JSONGenerator';
import JSONGenerator from '../../helpers/JSONGenerator';
import AnswerTypes from '../../types/IAnswer';
import { useTranslation } from 'react-i18next';

function NavBar(): JSX.Element {
    const { state } = useContext(FormContext);
    const [formPreview, setFormPreview] = useState(false);
    const { Title } = Typography;
    const { t } = useTranslation();

    function convertForm(): fhir.Questionnaire {
        const questionnaire = JSONConverter(
            state.title,
            state.description,
            state.sectionOrder,
            state.sections,
            state.questions,
        );
        return questionnaire;
    }

    const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
        input !== null && input.tagName === 'IFRAME';

    function iFrameLoaded() {
        const questionnaireString = JSON.stringify(
            JSONGenerator(state.title, state.description, state.sectionOrder, state.sections, state.questions),
        );

        const schemeDisplayer = document.getElementById('schemeFrame');
        if (isIFrame(schemeDisplayer) && schemeDisplayer.contentWindow) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schemeDisplayer.contentWindow.postMessage(
                {
                    questionnaireString: questionnaireString,
                    showFooter: false,
                },
                '*',
            );
        }
    }

    function exportToJsonAndDownload() {
        const questionnaire = convertForm();
        const filename = questionnaire.title + '.json';
        const contentType = 'application/json;charset=utf-8;';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(questionnaire)))], {
                type: contentType,
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(questionnaire));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    function validateForm(): boolean {
        if (state.description.length === 0 || state.description === undefined) {
            return false;
        }
        if (state.title === '' || state.title === undefined) {
            return false;
        }
        const sectionArray = Object.values(state.sections);
        if (sectionArray.length > 1) {
            for (let j = 0; j < sectionArray.length; j++) {
                if (!sectionArray[j].sectionTitle) {
                    return false;
                }
            }
        }
        const questionArray = Object.values(state.questions);
        for (let i = 0; i < questionArray.length; i++) {
            if (
                (!questionArray[i].questionText && questionArray[i].answerType !== AnswerTypes.info) ||
                questionArray[i].answerType === AnswerTypes.default
            ) {
                return false;
            }
        }
        return true;
    }
    function confirmPreview() {
        setFormPreview(true);
    }

    return (
        <div className="nav-bar">
            <Modal
                title={t('Form as seen by respondant')}
                visible={formPreview}
                onOk={() => setFormPreview(false)}
                destroyOnClose={true}
                width="90vw"
                style={{ top: '10px' }}
                footer={[
                    <Button key="submit" type="primary" onClick={() => setFormPreview(false)}>
                        {t('Close')}
                    </Button>,
                ]}
                onCancel={() => setFormPreview(false)}
            >
                <div style={{ height: '100%', width: '100%' }} className="iframe-div">
                    <iframe
                        id="schemeFrame"
                        title={t('Preview')}
                        style={{
                            width: '100%',
                            height: '70vh',
                        }}
                        onLoad={iFrameLoaded}
                        src="../../iframe/index.html"
                    ></iframe>
                </div>
            </Modal>
            <Row>
                <Col span={1}>
                    <Tooltip title="Tilbake">
                        <Button
                            style={{
                                margin: '5px',
                                float: 'left',
                                color: 'var(--color-base-1)',
                            }}
                            className="back-button"
                            type="link"
                            shape="circle"
                            icon={<LeftOutlined />}
                            onClick={() => window.history.back()}
                        />
                    </Tooltip>
                </Col>
                <Col lg={17} md={12}>
                    <Title level={3} style={{ color: 'var(--color-base-1)', float: 'left' }}>
                        {t('Form designer')}
                    </Title>
                </Col>
                <Col lg={6} md={11}>
                    <div style={{ float: 'right' }}>
                        <Button
                            className="nav-button"
                            type="link"
                            size="large"
                            style={{ margin: '2px' }}
                            key="previewForm"
                            onClick={() => {
                                if (validateForm()) {
                                    setFormPreview(true);
                                } else {
                                    Modal.confirm({
                                        content: t('Are you sure you want to preview?'),
                                        icon: <ExclamationCircleOutlined />,
                                        title: t('Not finished'),
                                        okText: t('Yes'),
                                        cancelText: t('Cancel'),
                                        onOk: confirmPreview,
                                    });
                                }
                            }}
                        >
                            {t('Preview')}
                        </Button>
                        <Button
                            className="nav-button"
                            type="link"
                            size="large"
                            style={{ margin: '2px 10px' }}
                            key="saveForm"
                            onClick={() => {
                                if (validateForm()) {
                                    message.success({
                                        content: t('Form was downloaded.'),
                                    });
                                    exportToJsonAndDownload();
                                } else {
                                    Modal.confirm({
                                        content: t('Save?'),
                                        icon: <ExclamationCircleOutlined />,
                                        title: t('All fields not filled out.'),
                                        okText: t('Yes'),
                                        cancelText: t('Cancel'),
                                        onOk: exportToJsonAndDownload,
                                    });
                                }
                            }}
                        >
                            {t('Save')}
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default NavBar;
