import React from 'react';
import { Collapse, Row, Col, Popover, Button, Card } from 'antd';
import './Schemes.style.scss';

const Schemes = () => {
    const { Panel } = Collapse;

    const title = 'Sykdomsskjema';

    const sections = [
        {
            sect: 'Symptomer',
            key: '1',
            qa: [
                {
                    q:
                        'Har du i løpet av de siste syv dagene fått symptomer som kan skyldes koronavirus? ',
                    a: ['ja'],

                    b: ['ja', 'nei'],
                },
                {
                    q: 'Hvilke symptomer har du hatt?',
                    a: [
                        'Tett eller rennende nese',
                        'Hoste',
                        'Tap av smaks- eller luktesans',
                        'Sår hals',
                    ],
                    b: ['Hoste', 'Feber', 'Sår hals', 'Andre'],
                },
                { q: 'spørsmål3', a: ['svar3'], b: [] },
            ],
        },
        {
            sect: 'Sykdom',
            key: '2',
            qa: [
                { q: 'spørsmål4: ', a: ['svar4'], b: [] },
                { q: 'spørsmål5', a: ['svar5'], b: ['heu', 'sei', 'meg'] },
                { q: 'spørsmål6', a: ['svar6'], b: [] },
            ],
        },
        {
            sect: 'Korona',
            key: '3',
            qa: [
                { q: 'spørsmål7: ', a: ['svar7'], b: [] },
                { q: 'spørsmål8', a: ['svar8'], b: [] },
                { q: 'spørsmål9', a: ['svar9'], b: ['yo', 'lo', 'no'] },
                { q: 'spørsmål10: ', a: ['svar10'], b: [] },
                { q: 'spørsmål11', a: ['svar11'], b: [] },
                { q: 'spørsmål12', a: ['svar12'], b: [] },
            ],
        },
    ];

    function setContent(data: string[]) {
        return data.map((line) => <li key={line}>{line}</li>);
    }
    return (
        <>
            <Row justify="center">
                <div className="card">
                    <h1 className="title"> {title} </h1>
                    <Collapse
                        bordered={false}
                        style={{ width: 1000 }}
                        className="site-collapse-custom-collapse"
                    >
                        {sections.map(({ sect, key, qa }) => (
                            <Panel
                                header={sect}
                                key={key}
                                className="site-collapse-custom-panel"
                            >
                                {qa.map(({ q, a, b }) => (
                                    <>
                                        <div className="boarder">
                                            <br></br>
                                            <p className="questions"> {q}</p>
                                            <p className="bold">Svar:</p>
                                            {a.map((item) => (
                                                <p
                                                    className="answers"
                                                    key={item}
                                                >
                                                    {item}
                                                </p>
                                            ))}
                                            {b.length > 0 ? (
                                                <Popover
                                                    placement="rightTop"
                                                    trigger="click"
                                                    content={setContent(b)}
                                                >
                                                    <Button
                                                        className="nopadding"
                                                        type="link"
                                                    >
                                                        (Vis alternativer)
                                                    </Button>
                                                </Popover>
                                            ) : null}
                                        </div>
                                    </>
                                ))}
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            </Row>
        </>
    );
};

export default Schemes;
