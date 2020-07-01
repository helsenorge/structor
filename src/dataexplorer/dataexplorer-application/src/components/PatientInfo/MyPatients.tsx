import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import Search from 'antd/lib/input/Search';
import { History } from 'history';

const MyPatients = (props: { history: History }) => {
    localStorage.clear();
    const [patientID, setPatientID] = useState(
        localStorage.getItem('myData') || '',
    );

    useEffect(() => {
        localStorage.setItem('myData', patientID);
    }, [patientID]);
    return (
        <>
            <div style={{ marginTop: 90 }}></div>
            <Row gutter={[60, 40]} justify={'center'}>
                <Col span={300}>
                    <p>Søk med personnummer for å finne en pasient.</p>
                    <Search
                        style={{ width: 400 }}
                        placeholder="Søk etter en pasient!"
                        onSearch={(value: string) => setPatientID(value)}
                    />
                </Col>
            </Row>
            {patientID &&
                props.history.push({ pathname: 'Pasient', state: patientID })}
        </>
    );
};
export default MyPatients;
