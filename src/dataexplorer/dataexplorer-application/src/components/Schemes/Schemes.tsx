import React from 'react';
import { Collapse, Row, Popover, Button } from 'antd';
import './Schemes.style.scss';

type Schemetype = {
    title: string;
    sections: {
        sect: string;
        key: string;
        qa: {
            q: string;
            a: string[];
            alt: string[];
            subarray: {
                subq: string;
                suba: string[];
                subalt: string[];
            }[];
        }[];
    }[];
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Schemes = ({ title, sections }: Schemetype) => {
    const { Panel } = Collapse;

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
                                {qa.map(({ q, a, alt, subarray }) => (
                                    <>
                                        <div className="boarder">
                                            <br></br>
                                            <p className="questions"> {q}</p>
                                            <p className="inline">Svar: </p>
                                            {alt.length > 0 ? (
                                                <Popover
                                                    placement="rightTop"
                                                    trigger="click"
                                                    content={setContent(alt)}
                                                >
                                                    <Button
                                                        className="nopadding"
                                                        type="link"
                                                    >
                                                        (Vis alternativer)
                                                    </Button>
                                                </Popover>
                                            ) : null}
                                            {a.map((item) => (
                                                <p
                                                    className="answers"
                                                    key={item}
                                                >
                                                    {item}
                                                </p>
                                            ))}
                                            {subarray.map(
                                                ({ subalt, subq, suba }) =>
                                                    suba.length > 0 ? (
                                                        <>
                                                            <br></br>
                                                            <p className="questions">
                                                                {subq}
                                                            </p>
                                                            <p className="inline">
                                                                Svar:{' '}
                                                            </p>
                                                            {subalt.length >
                                                            0 ? (
                                                                <Popover
                                                                    placement="rightTop"
                                                                    trigger="click"
                                                                    content={setContent(
                                                                        subalt,
                                                                    )}
                                                                >
                                                                    <Button
                                                                        className="nopadding"
                                                                        type="link"
                                                                    >
                                                                        (Vis
                                                                        alternativer)
                                                                    </Button>
                                                                </Popover>
                                                            ) : null}
                                                            <p className="answers">
                                                                {suba}
                                                            </p>
                                                        </>
                                                    ) : null,
                                            )}
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
