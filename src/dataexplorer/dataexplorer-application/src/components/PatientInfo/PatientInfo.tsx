import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatient, IPatientIdentifier, IRecord } from 'types/IPatient';
import { Row, Col, Card, Table, message, Empty } from 'antd';
import PatientQuestionnaireResponses from '../PatientQuestionnaireResponses/PatientQuestionnaireResponses';

interface IPatientInfoProps {
    setName: (name: string) => void;
    setSchema: (id: string) => void;
    patientID?: string | null | {};
}

const PatientInfo = ({ patientID, setName, setSchema }: IPatientInfoProps) => {
    const handleClick = (record: IRecord) => {
        message.info('Du har valgt Skjema ' + record.id);
        setSchema(record.schemaName);
    };
    // The oid signifies that we are searching on social security number
    const { response: patientData } = useFetch<IPatientIdentifier>(
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' +
            patientID,
    );

    if (patientData && patientData !== undefined) {
        const name =
            patientData.entry[0].resource.name[0].given[0] +
            ' ' +
            patientData.entry[0].resource.name[0].family;
        // Since the search uses social security number, which are
        // unique, the response will contain a maximum value of 1,
        // if the patient exists in the database.
        if (patientData.total === 1) {
            setName(name);
            return displayPatientInfo(
                patientData.entry[0].resource,
                handleClick,
            );
        }
    }
    return (
        <div className="failed" style={{ marginTop: 200 }}>
            <Empty
                description={
                    <span>Fant ingen pasienter med dette personnummeret</span>
                }
            ></Empty>
        </div>
    );
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

const displayPatientInfo = (patient: IPatient, handleClick: any) => {
    const name = patient.name[0].given[0] + ' ' + patient.name[0].family;
    return (
        <>
            <Row gutter={[1, 40]} justify="center">
                <Col span={12}>
                    <Card
                        style={{ marginTop: 100 }}
                        type="inner"
                        hoverable
                        key={patient.id}
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
                                <b>
                                    <i>
                                        <h1>Personlig Informasjon</h1>
                                    </i>
                                </b>
                                <p>
                                    <b>Pnr: </b> {patient.id}
                                </p>
                                <p>
                                    <b>Kjønn: </b> {patient.gender}
                                </p>
                                <p>
                                    <b>Fødselsdato:</b> {patient.birthDate}
                                </p>
                            </div>
                            <div className="info-right">
                                <b>
                                    <i>
                                        <h1>Kontakt</h1>
                                    </i>
                                </b>
                                <p>
                                    <b>Addresse: </b>
                                    {patient?.address?.[0]?.line?.[0]}
                                </p>
                                <p>
                                    <b>Telefon: </b>
                                    {patient?.telecom?.[0]?.value}
                                </p>
                                <p>
                                    <b>E-post: </b>
                                    eksempel@epost.no
                                </p>
                            </div>
                        </div>
                    </Card>
                    <PatientQuestionnaireResponses patientID={patient.id} />
                    <Table
                        key={patient.id}
                        style={{ marginTop: 20 }}
                        size="small"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{ pageSize: 12 }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    handleClick(record);
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
