import React from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatient, IPatientIdentifier } from 'types/IPatient';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const PatientInfo = ({ patientID }: any) => {
    // The oid signifies that we are searching on social security number
    const { response: patientData } = useFetch<IPatientIdentifier>(
        'fhir/Patient?identifier=urn:oid:2.16.840.1.113883.2.4.6.3|' +
            patientID,
    );

    if (patientData && patientData !== undefined) {
        // Since the search uses social security number, which are
        // unique, the response will contain a maximum value of 1,
        // if the patient exists in the database.
        if (patientData.total === 1) {
            return displayPatientInfo(patientData.entry[0].resource);
        }
    }
    return <div>Fant ingen pasienter med dette personnummeret</div>;
};

const displayPatientInfo = (response: IPatient) => {
    console.log(response);

    const name = response.name[0].given[0] + ' ' + response.name[0].family;
    return (
        <>
            <Link to="./Pasient/SkjemaVisning">
                <Row justify={'center'}>
                    <Col span={8}>
                        <Card
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
                                <Avatar
                                    shape="square"
                                    size={120}
                                    icon={<UserOutlined />}
                                />

                                <div className="info-left">
                                    <h1>Informasjon</h1>
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
                                    <h1>Kontakt</h1>
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
                                        erling.vande.weijer@gmail.com
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Link>
        </>
    );
};

export default PatientInfo;
