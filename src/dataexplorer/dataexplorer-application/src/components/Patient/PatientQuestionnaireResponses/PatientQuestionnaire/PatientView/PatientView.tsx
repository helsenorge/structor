import React from 'react';
import { IPatient, IRecord } from 'types/IPatient';
import { Row, Col, Card, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import './PatientView.style.scss';
import { useHistory } from 'react-router-dom';
import {
    IdcardOutlined,
    ManOutlined,
    HourglassOutlined,
    MobileOutlined,
    HomeOutlined,
} from '@ant-design/icons';

const PatientView = (props: {
    patient: IPatient;
    dataSource: fhir.ResourceBase[];
    setSchema: (id: string) => void;
}) => {
    const history = useHistory();
    const calcAge = () => {
        const birthday = props.patient.birthDate;
        const patientYear = parseInt(birthday.substring(0, 4));
        const patientMonth = dayjs(birthday.substring(5, 7))
            .locale('nb')
            .format('MMMM');
        const patientDay = parseInt(birthday.substring(8, 10));
        const actualAge = dayjs().diff(birthday, 'year');

        return (
            actualAge +
            ' år, født ' +
            patientDay +
            '. ' +
            patientMonth +
            ' ' +
            patientYear
        );
    };
    const { Title } = Typography;
    const name =
        props.patient.name[0].given[0] + ' ' + props.patient.name[0].family;
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a: any, b: any) => a.id - b.id,
        },
        {
            title: 'Skjemanavn',
            dataIndex: 'schemaName',
            key: 'schemaName',
        },
        {
            title: 'Innsendt',
            dataIndex: 'submitted',
            key: 'submitted',
        },
    ];

    const handleClick = (record: IRecord) => {
        props.setSchema(record.id);
        history.push('/pasient/skjema');
    };

    return (
        <>
            <Row gutter={[1, 40]} justify="center">
                <Col span={8}>
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
                                    <h4>
                                        <IdcardOutlined className="field-icon" />
                                        Personnummer:
                                    </h4>

                                    <p>{props.patient.identifier[0].value}</p>
                                </div>
                                <div className="item-container">
                                    <h4>
                                        <ManOutlined className="field-icon" />
                                        Kjønn:
                                    </h4>
                                    <p>
                                        {props.patient.gender !== 'male' &&
                                        props.patient.gender !== 'female'
                                            ? props.patient.gender
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              props.patient.gender.slice(1)
                                            : props.patient.gender === 'male'
                                            ? 'Mann'
                                            : 'Kvinne'}
                                    </p>
                                </div>
                                <div className="item-container">
                                    <h4>
                                        <HourglassOutlined className="field-icon" />
                                        Alder:
                                    </h4>
                                    <p>
                                        {props.patient.birthDate !==
                                        undefined ? (
                                            calcAge()
                                        ) : (
                                            <div>Ikke oppgitt</div>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {console.log(props.patient)}
                            <div className="info-right">
                                <div className="item-container">
                                    <h4>
                                        <HomeOutlined className="field-icon" />
                                        Adresse:
                                    </h4>
                                    {props.patient?.address?.[0]?.line !==
                                    undefined ? (
                                        <p>
                                            {
                                                props.patient?.address?.[0]
                                                    ?.line?.[0]
                                            }
                                        </p>
                                    ) : (
                                        <div className="unavailable-content">
                                            Ikke oppgitt
                                        </div>
                                    )}
                                </div>
                                <div className="item-container">
                                    <h4>
                                        <MobileOutlined className="field-icon" />
                                        Telefon:
                                    </h4>
                                    {props.patient?.telecom?.[0]?.value !==
                                    undefined ? (
                                        <p>
                                            {props.patient?.telecom?.[0]?.value}
                                        </p>
                                    ) : (
                                        <div className="unavailable-content">
                                            Ikke oppgitt
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row justify="center">
                <Col span={12}>
                    <Table
                        key={'Patient Questionnaire Response Key'}
                        rowKey={(record) =>
                            record.id ? record.id : 'waiting for response'
                        }
                        className="patient-table"
                        dataSource={props.dataSource}
                        columns={columns}
                        rowClassName={(record, index) =>
                            index % 2 === 0
                                ? 'table-row-light'
                                : 'table-row-dark'
                        }
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    handleClick(record as IRecord);
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
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default PatientView;
