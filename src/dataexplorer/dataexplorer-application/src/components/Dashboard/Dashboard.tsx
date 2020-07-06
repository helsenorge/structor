import React, { useState, useEffect } from 'react';
import Search from 'antd/lib/input/Search';
import { History } from 'history';
import { Row, Col } from 'antd';
import './Dashboard.style.scss';

const Dashboard = (props: { history: History }) => {
    localStorage.clear();
    const [patientID, setPatientID] = useState(
        localStorage.getItem('myData') || '',
    );

    useEffect(() => {
        localStorage.setItem('myData', patientID);
    }, [patientID]);
    return (
        <>
            <div className="search-container"></div>
            <Row gutter={[60, 40]} justify={'center'}>
                <Col span={1000}>
                    <p>Søk med personnummer for å finne en pasient</p>
                    <Search
                        style={{ width: 400 }}
                        className="search-bar"
                        placeholder="Søk etter en pasient!"
                        onSearch={(value: string) => setPatientID(value)}
                    />
                </Col>
            </Row>
            {patientID &&
                props.history.push({ pathname: 'pasient', state: patientID })}
        </>
    );
};
export default Dashboard;
