import React from 'react';
import { Collapse, Row, Popover, Button } from 'antd';
import './Schemes.style.scss';
import { IQuestionAndAnswer } from 'types/IQuestionAndAnswer';
import { ResourceContainer } from 'types/fhirTypes/fhir';
import { IInclude, IConcept } from 'types/IQuestionnaireResources';

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

export interface SchemesProps {
    qAndA: IQuestionAndAnswer[];
    questionnaireResource: ResourceContainer[];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Schemes = (props: SchemesProps) => {
    const { Panel } = Collapse;

    function setContent(data: IConcept[]) {
        if (data) {
            return data.map((line) => <li key={line.code}>{line.display}</li>);
        }
        return;
    }

    return (
        <>
            <Row justify="center">
                <div className="card">
                    <h1 className="title"> Tittel </h1>
                    <Collapse
                        bordered={false}
                        style={{ width: 1000 }}
                        className="site-collapse-custom-collapse"
                    >
                        {props.qAndA.map((i) => (
                            i.id.match('^[^.]*$') ? (
                                <Panel
                                    header={i.questions.questions.text}
                                    key={i.id}
                                    className="site-collapse-custom-panel"
                                >  : (
                                    <>
                                        <div className="boarder">
                                            <br></br>
                                            <p className="questions">
                                                {i.questions.questions.text}
                                            </p>
                                            <p className="inline">Svar: </p>
                                            {props.questionnaireResource.map(qr => qr.id ===
                                                i.questions.questions.options?.reference?.slice(1) &&
                                                (
                                                    props.questionnaireResource.length > 0 ? (
                                                        qr.compose.include.map((m) =>
                                                            <Popover
                                                                placement="rightTop"
                                                                trigger="click"
                                                                content={setContent(m.concept)}
                                                            >
                                                                <Button
                                                                    className="nopadding"
                                                                    type="link"
                                                                >
                                                                    (Vis alternativer)
                                                        </Button>
                                                            </Popover>)
                                                    ) : null
                                                ))}
                                            {i.answers?.answers.answer?.map((item) => (
                                                <p
                                                    className="answers"
                                                    key={item.id}
                                                >
                                                    {item.valueBoolean}
                                                    {item.valueCoding?.display}
                                                    {item.valueDate}
                                                    {item.valueDecimal}
                                                    {item.valueString}
                                                </p>
                                            ))}
                                            {/* {subarray.map(
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
                                                )} */}
                                        </div>
                                    </>
                                    )
                                </Panel>

                            ))}
                    </Collapse>
                </div>
            </Row>
        </>
    );
};

export default Schemes;
