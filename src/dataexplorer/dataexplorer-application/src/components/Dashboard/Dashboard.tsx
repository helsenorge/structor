import React, { useContext, useEffect, useState } from 'react';
import Search from 'antd/lib/input/Search';
import { Row, Col } from 'antd';
import './Dashboard.style.scss';
import PatientPreview from './PatientPreview/PatientPreview';
import FloatLabel from './FloatLabel/FloatLabel';
import './FloatLabel/FloatLabel.scss';
import { PatientContext } from 'components/Patient/PatientContext';
import { IPatientIdentifier } from 'types/IPatient';

const Dashboard = () => {
    const { patientId, setPatientId, setName, setSchemanumber, setPatient } = useContext(PatientContext);
    const [searchValue, setFirstName] = useState('');
    const handleClick = (value: string) => {
        setPatientId(value);
    };
    useEffect(() => {
        setName('');
        setPatientId('');
        setSchemanumber('');
        setPatient({} as IPatientIdentifier);
    }, [setName, setPatientId, setSchemanumber, setPatient]);

    return (
        <>
            <div className="search-container"></div>
            <Row gutter={[60, 40]} justify={'center'}>
                <Col span={1000}>
                    <FloatLabel label="Personnummer" name="searchfield" value={searchValue}>
                        <Search
                            placeholder={searchValue}
                            onChange={(e) => setFirstName(e.target.value)}
                            onSearch={(value: string) => handleClick(value)}
                        />
                    </FloatLabel>
                    {patientId !== '' && <PatientPreview />}
                </Col>
            </Row>
        </>
    );
};
export default Dashboard;
