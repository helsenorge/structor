import React, { useContext, useEffect } from 'react';
import Search from 'antd/lib/input/Search';
import { Row, Col } from 'antd';
import './Dashboard.style.scss';
import { useHistory } from 'react-router-dom';
import { BreadcrumbContext } from 'components/Navigation/Breadcrumbs/BreadcrumbContext';

const Dashboard = () => {
    const { setPatientId, setName, setSchemanumber } = useContext(
        BreadcrumbContext,
    );
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
                    <Search
                        style={{ width: 400 }}
                        className="search-bar"
                        placeholder="Søk med personnummer for å finne en pasient"
                        onSearch={(value: string) => handleClick(value)}
                        allowClear={true}
                    />
                </Col>
            </Row>
        </>
    );
};
export default Dashboard;
