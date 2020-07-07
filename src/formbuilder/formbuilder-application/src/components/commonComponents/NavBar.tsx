import React, { useContext, useState } from 'react';
import { Button, Tooltip, Row, Col, Typography, Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { FormContext } from '../../store/FormStore';
import './NavBar.css';
import JSONConverter from '../../helpers/JSONGenerator';
import JSONGenerator from '../../helpers/JSONGenerator';

function NavBar(): JSX.Element {
    const { state } = useContext(FormContext);
    const [formPreview, setFormPreview] = useState(false);
    const { Title } = Typography;

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
            JSONGenerator(
                state.title,
                state.description,
                state.sectionOrder,
                state.sections,
                state.questions,
            ),
        );

        const schemeDisplayer = document.getElementById('schemeFrame');
        if (isIFrame(schemeDisplayer) && schemeDisplayer.contentWindow) {
            console.log('Fant frame');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schemeDisplayer.contentWindow.postMessage(
                {
                    questionnaireString: questionnaireString,
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
            const blob = new Blob(
                [decodeURIComponent(encodeURI(JSON.stringify(questionnaire)))],
                { type: contentType },
            );
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const a = document.createElement('a');
            a.download = filename;
            a.href =
                'data:' +
                contentType +
                ',' +
                encodeURIComponent(JSON.stringify(questionnaire));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    return (
        <div className="nav-bar">
            <Modal
                title="Slik ser skjemaet ut for utfyller"
                visible={formPreview}
                onOk={() => setFormPreview(false)}
                destroyOnClose={true}
                width="90vw"
                style={{ top: '10px' }}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => setFormPreview(false)}
                    >
                        Lukk
                    </Button>,
                ]}
                onCancel={() => setFormPreview(false)}
            >
                <div style={{ height: '100%', width: '100%' }}>
                    <iframe
                        id="schemeFrame"
                        title="Forhåndsvis skjema"
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
                        {/* <Link to="preview"> */}
                        <Button
                            className="nav-button"
                            type="link"
                            size="large"
                            style={{ margin: '2px' }}
                            key="previewForm"
                            onClick={() => setFormPreview(true)}
                        >
                            Forhåndsvisning
                        </Button>
                        {/* </Link> */}
                        <Button
                            className="nav-button"
                            type="link"
                            size="large"
                            style={{ margin: '2px 10px' }}
                            key="saveForm"
                            onClick={exportToJsonAndDownload}
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