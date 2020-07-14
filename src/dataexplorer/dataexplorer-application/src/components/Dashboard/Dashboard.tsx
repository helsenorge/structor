import React, { useContext, useEffect, useState } from 'react';
import Search from 'antd/lib/input/Search';
import { Row, Col, message } from 'antd';
import PatientPreview from './PatientPreview/PatientPreview';
import FloatLabel from './FloatLabel/FloatLabel';
import './Dashboard.style.scss';
import './FloatLabel/FloatLabel.scss';
import { PatientContext } from 'components/Patient/PatientContext';
import { IPatientIdentifier } from 'types/IPatient';

const Dashboard = () => {
    const { patientId, setPatientId, setName, setSchemanumber, setPatient } = useContext(PatientContext);
    const [searchValue, setSearchValue] = useState('');
    const handleChange = (e: any) => {
        isNaN(e.target.value)
            ? message.warning('Du har tastet en bokstav. Vennligst benytt siffer.')
            : setSearchValue(e.target.value);
    };

    message.config({ maxCount: 1 });
    const handleSearch = (value: string) => {
        value.length === 11
            ? setPatientId(value)
            : message.warning(`Personnummeret du har skrevet er ugyldig, og mangler ${11 - value.length} siffer.`, 3.5);
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
                            maxLength={11}
                            placeholder={searchValue}
                            onChange={(e) => handleChange(e)}
                            onSearch={(value) => handleSearch(value)}
                            value={searchValue}
                        />
                    </FloatLabel>
                    {patientId !== '' && <PatientPreview />}
                </Col>
            </Row>
        </>
    );
};
export default Dashboard;
