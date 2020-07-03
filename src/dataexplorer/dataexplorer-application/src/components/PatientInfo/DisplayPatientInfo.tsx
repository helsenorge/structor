import React from 'react';
import { IPatient } from 'types/IPatient';
import { Row, Col, Card, Table } from 'antd';
import './PatientInfo.style.scss';

const DisplayPatientInfo = (props: {
    patient: IPatient;
    handleClick: any;
    dataSource: fhir.ResourceBase[];
}) => {
    const name =
        props.patient.name[0].given[0] + ' ' + props.patient.name[0].family;
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
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
    ];
    console.log(props.patient);

    return (
        <>
            <Row gutter={[1, 40]} justify="center">
                <Col span={12}>
                    <Card
                        className="patient-card"
                        type="inner"
                        hoverable
                        key={props.patient.id}
                        title={name}
                    >
                        <div className="info-container">
                            <div className="info-left">
                                <h4>Pnr:</h4>
                                <span>{props.patient.id}</span>
                                <h4>Kjønn:</h4>
                                <span>{props.patient.gender}</span>
                                <h4>Fødselsdato:</h4>
                                <span>{props.patient.birthDate}</span>
                            </div>

                            <div className="info-right">
                                <h4>Addresse: </h4>
                                <span>
                                    {props.patient?.address?.[0]?.line?.[0]}
                                </span>
                                <h4>Telefon: </h4>
                                <span>
                                    {props.patient?.telecom?.[0]?.value}
                                </span>
                            </div>
                        </div>
                    </Card>
                    <Table
                        className="patient-table"
                        key={'Patient Questionnaire Response Key'}
                        rowKey={(record) =>
                            record.id ? record.id : 'waiting for response'
                        }
                        columns={columns}
                        dataSource={props.dataSource}
                        size="small"
                        pagination={{ pageSize: 12 }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    props.handleClick(record);
                                },
                            };
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default DisplayPatientInfo;
