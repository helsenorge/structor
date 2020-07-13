import React, { useContext, useEffect } from 'react';
import Search from 'antd/lib/input/Search';
import { Row, Col } from 'antd';
import './Dashboard.style.scss';
import { BreadcrumbContext } from 'components/Navigation/Breadcrumbs/BreadcrumbContext';
import PatientPreview from './PatientPreview/PatientPreview';

const Dashboard = () => {
    const { patientId, setPatientId, setName, setSchemanumber } = useContext(BreadcrumbContext);
    const handleClick = (value: string) => {
        setPatientId(value);
    };
    useEffect(() => {
        setName('');
        setPatientId('');
        setSchemanumber('');
    }, [setName, setPatientId, setSchemanumber]);

    return (
        <>
            <div className="search-container"></div>
            <Row gutter={[60, 40]} justify={'center'}>
                <Col span={1000}>
                    <Search
                        style={{ width: 400 }}
                        className="search-bar"
                        placeholder="Søk med personnummer for å finne en pasient"
                        onSearch={(value: string) => handleClick(value)}
                        allowClear={true}
                    />
                </Col>
            </Row>
            {patientId !== '' && <PatientPreview />}
        </>
    );
};
export default Dashboard;
