import React, { useContext, ReactText, useState, useEffect } from 'react';
import { IPatient, IDataSource } from 'types/IPatient';
import { Row, Col, Card, Table, Typography, Spin, Button, message, Empty } from 'antd';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import './PatientView.style.scss';
import 'components/Patient/Patient-style.scss';
import { PatientContext } from 'components/Patient/PatientContext';

const PatientView = (props: {
    patient: IPatient;
    dataSource: fhir.ResourceBase[];
    hasQuestionnaireResponses: boolean;
}) => {
    const history = useHistory();
    const { setSchemanumber, setComparableSchemaNumbers } = useContext(PatientContext);
    const [comparingSchemesIds, setComparingSchemesIds] = useState<ReactText[]>([]);
    const [compareSchemesMode, setCompareSchemesMode] = useState<boolean>(false);
    const [reachedMaxValue, setReachedMaxValue] = useState<boolean>(false);
    const MAX_VALUE = 2;

    const calcAge = () => {
        const birthday = props.patient.birthDate;
        const patientYear = parseInt(birthday.substring(0, 4));
        const patientMonth = parseInt(birthday.substring(5, 7));
        const patientDay = parseInt(birthday.substring(8, 10));
        const actualAge = dayjs().diff(birthday, 'year');

        return `${patientDay.toString()}.${patientMonth}.${patientYear.toString()} (${actualAge.toString()})`;
    };

    const { Title } = Typography;
    const name = props.patient.name[0].given[0] + ' ' + props.patient.name[0].family;
    const columns = [
        {
            title: 'Skjemanavn',
            dataIndex: 'schemaName',
            key: 'schemaName',
        },
        {
            title: 'Innsendt',
            dataIndex: 'submitted',
            key: 'submitted',
            sorter: (a: any, b: any) => dayjs(a.submitted).unix() - dayjs(b.submitted).unix(),
        },
    ];

    const handleClick = (record: IDataSource) => {
        record.id && setSchemanumber(record.id);
        history.push('/pasient/skjema');
    };

    const handleCompareClick = () => {
        setComparableSchemaNumbers(comparingSchemesIds);
        history.push('pasient/skjema-sammenligning');
    };

    const addComparingSchemeOnRowClick = (id: ReactText) => {
        setReachedMaxValue(false);
        setComparingSchemesIds((comparingQuestionnaires) => [...comparingQuestionnaires, id]);
    };

    const removeComparingSchemeOnRowClick = (id: ReactText) => {
        setReachedMaxValue(false);
        setComparingSchemesIds(comparingSchemesIds.filter((i) => i !== id));
    };

    useEffect(() => {
        if (reachedMaxValue) message.warning('Maximum to skjemaer', 3.5);
    }, [reachedMaxValue, comparingSchemesIds.length]);

    return (
        <>
            <Row gutter={[1, 40]} justify="center">
                <Col span={12}>
                    <Card
                        key={props.patient.id}
                        className="patient-card"
                        title={<Title level={4}>{name}</Title>}
                        type="inner"
                        bordered
                    >
                        <div className="info-container">
                            <div className="info-left">
                                <div className="item-container">
                                    <h4>Personnummer</h4>
                                    <p>{props.patient.identifier[0].value}</p>
                                </div>
                                <div className="item-container">
                                    <h4>Kjønn</h4>
                                    <p>
                                        {props.patient.gender !== 'male' && props.patient.gender !== 'female'
                                            ? props.patient.gender.charAt(0).toUpperCase() +
                                              props.patient.gender.slice(1)
                                            : props.patient.gender === 'male'
                                            ? 'Mann'
                                            : 'Kvinne'}
                                    </p>
                                </div>

                                <div className="item-container">
                                    <h4>Fødselsdato</h4>
                                    <div className="age">
                                        {props.patient.birthDate !== undefined ? (
                                            calcAge()
                                        ) : (
                                            <p className="unavailable-content">Ikke oppgitt</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="info-right">
                                <div className="item-container">
                                    <h4>Adresse</h4>
                                    {props.patient?.address?.[0]?.line !== undefined ? (
                                        <p>{props.patient?.address?.[0]?.line?.[0]}</p>
                                    ) : (
                                        <div className="unavailable-content">Ikke oppgitt</div>
                                    )}
                                </div>
                                <div className="item-container">
                                    <h4>Telefon</h4>
                                    {props.patient?.telecom?.[0]?.value !== undefined ? (
                                        <p>{props.patient?.telecom?.[0]?.value}</p>
                                    ) : (
                                        <div className="unavailable-content">Ikke oppgitt</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                    {props.dataSource.length > 1 && (
                        <Row>
                            <Col span={12}>
                                <Button
                                    className="compare-button"
                                    block
                                    onClick={() => setCompareSchemesMode(!compareSchemesMode)}
                                >
                                    {!compareSchemesMode && <p>Sammenlign to skjemaer</p>}
                                    {compareSchemesMode && <p>Slå av sammenligning</p>}
                                </Button>
                            </Col>
                            <Col span={12}>
                                {compareSchemesMode && comparingSchemesIds.length === 2 ? (
                                    <Button className="compare-button" block onClick={() => handleCompareClick()}>
                                        Sammenlign markerte skjemaer
                                    </Button>
                                ) : (
                                    <Button disabled className="compare-button" id="disabled" block>
                                        Sammenlign markerte skjemaer
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    )}
                    <Table
                        key={'Patient Questionnaire Response Key'}
                        rowKey={(record) => (record.id ? record.id : 'waiting for response')}
                        className="patient-table"
                        dataSource={props.dataSource as IDataSource[]}
                        columns={columns}
                        rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                        onRow={(record) => {
                            if (compareSchemesMode && !comparingSchemesIds.includes(record.id as ReactText)) {
                                if (comparingSchemesIds.length < MAX_VALUE) {
                                    return {
                                        onClick: () => addComparingSchemeOnRowClick(record.id as ReactText),
                                    };
                                } else
                                    return {
                                        onClick: () => setReachedMaxValue(true),
                                    };
                            } else if (compareSchemesMode && comparingSchemesIds.includes(record.id as ReactText)) {
                                return {
                                    onClick: () => removeComparingSchemeOnRowClick(record.id as ReactText),
                                };
                            } else
                                return {
                                    onClick: () => {
                                        handleClick(record);
                                    },
                                };
                        }}
                        pagination={{ pageSize: 10 }}
                        size="small"
                        bordered
                        showSorterTooltip={true}
                        locale={{
                            cancelSort: 'Nullstill sortering',
                            triggerAsc: 'Sorter i stigende rekkefølge',
                            triggerDesc: 'Sorter i synkende rekkefølge',
                            emptyText: <Empty description={'Pasienten har ingen skjemabesvarelser'} />,
                        }}
                        rowSelection={
                            props.dataSource.length > 1
                                ? compareSchemesMode
                                    ? {
                                          type: 'checkbox',
                                          hideSelectAll: true,
                                          onChange: (selectedRowKeys: ReactText[]) => {
                                              if (selectedRowKeys.length <= MAX_VALUE) {
                                                  setComparingSchemesIds(selectedRowKeys);
                                                  setReachedMaxValue(false);
                                              } else setReachedMaxValue(true);
                                          },
                                          selectedRowKeys: comparingSchemesIds,
                                      }
                                    : {
                                          type: 'checkbox',
                                          hideSelectAll: true,
                                          getCheckboxProps: () => ({
                                              disabled: true,
                                          }),
                                          selectedRowKeys: [],
                                      }
                                : undefined
                        }
                    />
                </Col>
            </Row>
            {props.dataSource.length === 0 && props.hasQuestionnaireResponses && (
                <Row justify="center">
                    <Spin className="spin-container" size="large" />
                </Row>
            )}
        </>
    );
};

export default PatientView;
