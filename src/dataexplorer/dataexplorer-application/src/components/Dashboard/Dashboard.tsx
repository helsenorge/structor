import React from 'react';
import { Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <>
            <Row justify={'center'}>
                <Col span={300}></Col>
            </Row>
            <Row style={{ paddingTop: 140 }} />
            <Row gutter={[105, 105]} justify={'center'}>
                <Col span={8}>
                    <Link to="/Pasient">
                        <Card title="Finn Pasient" hoverable bordered>
                            Klikk her for å gjøre et søk på pasienter. Du kan
                            her finne en pasient sine innsendte skjema, samt
                            informasjon om vedkommende.
                        </Card>
                    </Link>
                </Col>
                <Col span={8}>
                    <Card title="Lag Skjema" hoverable bordered>
                        Klikke her for å lage et nytt skjema, som kan sendes til
                        pasienter. Du kan finne utfylte skjemaer på pasientsiden
                        din.
                    </Card>
                </Col>
            </Row>
            <Row justify={'center'}>
                <Col span={8}>
                    <Card title="Mottatte Skjema" hoverable>
                        <p>Velkommen tilbake, Dr. House!</p>
                        <p>
                            Du har mottatt 7 nye skjemabesvarelser. Klikk her
                            for å lese disse.
                        </p>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;
