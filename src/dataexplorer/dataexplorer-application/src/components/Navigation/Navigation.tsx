import React, { useState } from 'react';
import { Layout, Avatar } from 'antd';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import 'antd/dist/antd.css';
import MyPatients from '../PatientInfo/MyPatients';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import PatientInfo from '../PatientInfo/PatientInfo';
import './Navigation.style.scss';
import SchemaResponse from 'components/SchemaResponse/SchemaResponse';

const { Header, Content } = Layout;
const Navigation = () => {
    const [name, setName] = useState('');
    const [schemaNumber, setSchema] = useState('');
    const patientID = localStorage.getItem('myData');

    return (
        <>
            <Layout>
                <Header className="site-layout-sub-header-background">
                    <Link to="/">
                        <h1>Datautforskeren</h1>
                    </Link>

                    <div className="avatar-container">
                        <Avatar
                            className="header-avatar"
                            shape="square"
                            size="large"
                            icon={<UserOutlined />}
                        />
                        <h1>Dr. Gregory House</h1>
                    </div>
                </Header>
                <div className="breadcrumb-header">
                    <Breadcrumbs
                        name={name}
                        schemaNumber={schemaNumber}
                        setName={setName}
                        setSchemaNumber={setSchema}
                    />
                </div>
                <Content>
                    <div className="content">
                        <Switch>
                            <Route exact path="/" component={MyPatients} />
                            <Route
                                exact
                                path="/Pasient"
                                render={() => (
                                    <PatientInfo
                                        setName={setName}
                                        setSchema={setSchema}
                                        patientID={patientID}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/Pasient/skjema"
                                render={() => (
                                    <SchemaResponse
                                        questionnaireResponseId={schemaNumber}
                                    />
                                )}
                            />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </>
    );
};

export default withRouter(Navigation);
