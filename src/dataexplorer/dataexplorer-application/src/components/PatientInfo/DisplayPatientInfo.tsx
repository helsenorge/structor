import React, { useState, useEffect } from 'react';
import useFetch from 'utils/hooks/useFetch';
import { IPatient, dataSourceType } from 'types/IPatient';
import { IQRIdentifier, IQRResource } from 'types/IQuestionnaireResponse';
import { Row, Col, Card, Table } from 'antd';
import './PatientInfo.style.scss';

const DisplayPatientInfo = (props: { patient: IPatient; handleClick: any }) => {
    const name =
        props.patient.name[0].given[0] + ' ' + props.patient.name[0].family;
    const [dataSource, setDataSource] = useState<dataSourceType[]>([]);
    const [QRData, setQRData] = useState<dataSourceType[]>([]);
    const [qResponse, setQResponse] = useState<string>();
    const { response: questionnaire } = useFetch<fhir.Questionnaire>(
        'fhir/' + qResponse,
    );
    const { response: questionnaireResponses } = useFetch<IQRIdentifier>(
        'fhir/QuestionnaireResponse?subject=Patient/' + props.patient.id,
    );
    const columns = [
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
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
    ];
    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
            questionnaireResponses.entry.map((item) => {
                setQResponse(
                    'fhir/' +
                        item.resource?.questionnaire?.reference?.substr(
                            item.resource?.questionnaire?.reference?.indexOf(
                                'Questionnaire/',
                            ),
                        ),
                );
            });
        }
    }, [questionnaireResponses]);

    function catchQuestionaires(item: IQRResource) {
        setQResponse(
            item.resource?.questionnaire?.reference?.substr(
                item.resource?.questionnaire?.reference?.indexOf(
                    'Questionnaire/',
                ),
            ),
        );
    }

    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
            questionnaireResponses.entry.map((item) => {
                catchQuestionaires(item);
                setQRData((QRData) => [
                    ...QRData,
                    {
                        id: item.resource.id,
                        schemaName: '',
                        submitted: item.resource.meta.lastUpdated.split('T')[0],
                    },
                ]);
            });
        }
    }, [questionnaireResponses]);

    useEffect(() => {
        if (questionnaireResponses && questionnaireResponses.total > 0) {
            QRData.map((item) => {
                setDataSource((dataSource) => [
                    ...dataSource,
                    {
                        id: item.id,
                        schemaName: questionnaire?.title,
                        submitted: item.submitted,
                    },
                ]);
            });
        }
    }, [questionnaire]);

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
                                <p>{props.patient.id}</p>
                                <p>
                                    <h4>Kjønn:</h4> {props.patient.gender}
                                </p>
                                <p>
                                    <h4>Fødselsdato:</h4>
                                    {props.patient.birthDate}
                                </p>
                            </div>
                            <div className="info-right">
                                <p>
                                    <h4>Addresse: </h4>
                                    {props.patient?.address?.[0]?.line?.[0]}
                                </p>
                                <p>
                                    <h4>Telefon: </h4>
                                    {props.patient?.telecom?.[0]?.value}
                                </p>
                                <p>
                                    <h4>E-post: </h4>
                                    eksempel@epost.no
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Table
                        className="patient-table"
                        key={props.patient.id}
                        columns={columns}
                        dataSource={dataSource}
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
