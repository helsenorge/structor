import React, { useState } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import MyPatients from '../PatientInfo/MyPatients';
import PatientInfo from '../PatientInfo/PatientInfo';
import 'antd/dist/antd.css';
import { Layout, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Navigation.style.scss';
import {History } from 'history'

const { Header, Content } = Layout;
const Navigation = (props: { history: History }) => {
    const [name, setName] = useState('');
    const [schemaNumber, setSchema] = useState('');

    return (
        <>
            <Layout>
                <Layout>
                    <Header className="site-layout-sub-header-background">
                        <Link to="/">
                            <h1>Datautforskeren</h1>
                        </Link>
                        <Breadcrumbs
                            name={name}
                            schemaNumber={schemaNumber}
                        />
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
                                            patientID={
                                                props.history.location.state
                                            }
                                        />
                                    )}
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
