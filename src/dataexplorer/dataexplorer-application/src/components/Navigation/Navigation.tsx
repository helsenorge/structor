import React, { useState } from 'react';
import { Layout, Avatar } from 'antd';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import 'antd/dist/antd.css';
import MySchemas from '../MySchemas/MySchemas';
import MyPatients from '../PatientInfo/MyPatients';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import ListView from '../PatientInfo/ListView/ListView';
import SchemaView from './SchemaView';
import { UserOutlined } from '@ant-design/icons';
import PatientInfo from '../PatientInfo/PatientInfo';

const { Header, Content } = Layout;
const Navigation = (props: any) => {
    const [name, setName] = useState('');
    const [schemaNumber, setSchemaNumber] = useState('');

    return (
        <>
            <Layout>
                <Layout>
                    <Header
                        className="site-layout-sub-header-background"
                        style={{
                            position: 'fixed',
                            zIndex: 1,
                            width: '100%',
                            flexDirection: 'row',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#EDF5E1',
                            borderBottom: 'solid lightgrey thin',
                            paddingLeft: 15,
                        }}
                    >
                        <Link to="/">
                            <h1
                                style={{
                                    color: 'black',
                                    margin: 0,
                                    paddingRight: 20,
                                    borderRight: 'solid lightgrey thin',
                                }}
                            >
                                Datautforskeren
                            </h1>
                        </Link>
                        <Breadcrumbs
                            style={{ flexGrow: 2, paddingLeft: 20 }}
                            name={name}
                            schemaNumber={schemaNumber}
                        />

                        <div
                            className="avatar-container"
                            style={{
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'row',
                                borderLeft: 'solid lightgrey thin',
                            }}
                        >
                            <Avatar
                                style={{
                                    marginLeft: 20,
                                    marginRight: 20,
                                    marginTop: 12,
                                }}
                                shape="square"
                                size="large"
                                icon={<UserOutlined />}
                            />
                            <h1 style={{ margin: 0, marginRight: -40 }}>
                                Dr. Gregory House
                            </h1>
                        </div>
                    </Header>
                    <Content
                        style={{ margin: '24px 16px 0', overflow: 'hidden' }}
                    >
                        <div className="content">
                            <Switch>
                                <Route exact path="/" component={MyPatients} />
                                <Route
                                    exact
                                    path="/Skjema"
                                    component={MySchemas}
                                />
                                <Route
                                    exact
                                    path="/Pasient"
                                    render={() => (
                                        <PatientInfo
                                            setName={setName}
                                            setSchemaNumber={setSchemaNumber}
                                            patientID={
                                                props.history.location.state
                                            }
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/Pasient/Skjemaisning"
                                    component={ListView}
                                />
                                <Route
                                    exact
                                    path="/Pasient/ListeVisning"
                                    component={SchemaView}
                                />
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default withRouter(Navigation);
