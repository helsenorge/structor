import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatient } from 'types/IPatient';
import { Card, Col, Row, Table, message } from 'antd';
import { Link } from 'react-router-dom';

const PatientInfo = ({ patientID }: any) => {
    console.log(useFetch<IPatient>('fhir/Patient/'));

    const { response } = useFetch<IPatient>('fhir/Patient/' + 1, 1);
    console.log(patientID);
    if (response && response !== undefined) {
        return displayPatientInfo(response);
    }
    return <div>no information</div>;
};

const dataSource = [
    {
        id: 1,
        schemaName: 'covid',
        submitted: '19.02.2020',
    },
    {
        id: 2,
        schemaName: 'covid',
        submitted: '24.02.2020',
    },
    {
        id: 3,
        schemaName: 'covid',
        submitted: '28.02.2020',
    },
    {
        id: 4,
        schemaName: 'covid',
        submitted: '01.03.2020',
    },
    {
        id: 5,
        schemaName: 'covid',
        submitted: '07.02.2020',
    },
    {
        id: 6,
        schemaName: 'covid',
        submitted: '14.03.2020',
    },
    {
        id: 7,
        schemaName: 'covid',
        submitted: '21.03.2020',
    },
    {
        id: 8,
        schemaName: 'covid',
        submitted: '19.02.2020',
    },
    {
        id: 9,
        schemaName: 'covid',
        submitted: '24.02.2020',
    },
    {
        id: 10,
        schemaName: 'covid',
        submitted: '28.02.2020',
    },
    {
        id: 11,
        schemaName: 'lykke',
        submitted: '01.03.2020',
    },
    {
        id: 12,
        schemaName: 'lykke',
        submitted: '07.02.2020',
    },
    {
        id: 13,
        schemaName: 'covid',
        submitted: '14.03.2020',
    },
    {
        id: 14,
        schemaName: 'lykke',
        submitted: '21.03.2020',
    },
    {
        id: 15,
        schemaName: 'covid',
        submitted: '19.02.2020',
    },
    {
        id: 16,
        schemaName: 'lykke',
        submitted: '24.02.2020',
    },
    {
        id: 17,
        schemaName: 'covid',
        submitted: '28.02.2020',
    },
    {
        id: 18,
        schemaName: 'lykke',
        submitted: '01.03.2020',
    },
    {
        id: 19,
        schemaName: 'kreft',
        submitted: '07.02.2020',
    },
    {
        id: 20,
        schemaName: 'covid',
        submitted: '14.03.2020',
    },
    {
        id: 21,
        schemaName: 'covid',
        submitted: '21.03.2020',
    },
];

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Skjemanavn',
        dataIndex: 'schemaName',
        key: 'skjemanavn',
    },
    {
        title: 'Innsendt',
        dataIndex: 'submitted',
        key: 'submitted',
    },
];

const displayPatientInfo = (response: IPatient) => {
    console.log(response);

    const name = response.name[0].given[0] + ' ' + response.name[0].family;
    return (
        <>
            <Row gutter={[1, 40]} justify="center">
                <Col span={12}>
                    <Link to="./Pasient/ListeVisning">
                        <Card
                            style={{ marginTop: -73 }}
                            type="inner"
                            hoverable
                            key={response.id}
                            title={name}
                        >
                            <div
                                className="info-container"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div className="info-left">
                                    {/* <b>
                                        <i>
                                            <h1>Personlig Informasjon</h1>
                                        </i>
                                    </b> */}
                                    <p>
                                        <b>Pnr: </b> {response.id}
                                    </p>
                                    <p>
                                        <b>Kjønn: </b> {response.gender}
                                    </p>
                                    <p>
                                        <b>Fødselsdato:</b> {response.birthDate}
                                    </p>
                                </div>
                                <div className="info-right">
                                    {/* <b>
                                        <i>
                                            <h1>Kontakt</h1>
                                        </i>
                                    </b> */}
                                    <p>
                                        <b>Addresse: </b>
                                        {response.address[0].line[0]}
                                    </p>
                                    <p>
                                        <b>Telefon: </b>
                                        {response.telecom[0].value}
                                    </p>
                                    <p>
                                        <b>E-post: </b>
                                        eksempel@epost.no
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Table
                        style={{ marginTop: 20 }}
                        size="small"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{ pageSize: 8 }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    message.info(
                                        'Du har valgt Skjema ' + record.id,
                                    );
                                },
                            };
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default PatientInfo;
