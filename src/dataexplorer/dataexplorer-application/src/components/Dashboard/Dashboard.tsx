import React, { useContext, useEffect, useState } from 'react';
import Search from 'antd/lib/input/Search';
import { Row, Col } from 'antd';
import './Dashboard.style.scss';
import { useHistory } from 'react-router-dom';
import { BreadcrumbContext } from 'components/Navigation/Breadcrumbs/BreadcrumbContext';
import FloatLabel from './FloatLabel';
import './FloatLabel.scss';

const Dashboard = () => {
    const [searchValue, setFirstName] = useState('');
    const { setPatientId, setName, setSchemanumber } = useContext(BreadcrumbContext);
    const history = useHistory();
    const handleClick = (value: string) => {
        setPatientId(value);
        history.push('/pasient');
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
                    <FloatLabel label="Personnummer" name="searchfield" value={searchValue}>
                        <Search
                            placeholder={searchValue}
                            onChange={(e) => setFirstName(e.target.value)}
                            onSearch={(value: string) => handleClick(value)}
                        />
                    </FloatLabel>
                </Col>
            </Row>
        </>
    );
};
export default Dashboard;
