import React, { useState } from 'react';
import { Row, Col } from 'antd';
import Search from 'antd/lib/input/Search';
import PatientInfo from 'components/PatientInfo/PatientInfo';
const MyPatients = () => {
    const [patientID, setPatientID] = useState();
    return (
        <>
            <div>View for mine Pasienter</div>
            <Row gutter={[60, 40]} justify={'center'}>
                <Col span={300}>
                    <Search onSearch={(value) => setPatientID(value)} />
                </Col>
            </Row>
            {patientID && <PatientInfo patientID={patientID} />}
        </>
    );
};
export default MyPatients;
