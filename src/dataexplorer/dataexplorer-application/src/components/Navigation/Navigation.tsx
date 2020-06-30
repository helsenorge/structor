import React, { useState } from 'react';
import { Layout, Avatar } from 'antd';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import 'antd/dist/antd.css';
import MyPatients from '../PatientInfo/MyPatients';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import PatientInfo from '../PatientInfo/PatientInfo';
import './Navigation.style.scss';
import {History } from 'history'

const { Header, Content } = Layout;
const Navigation = (props: { history: History }) => {
    const [name, setName] = useState('');
    const [schemaNumber, setSchema] = useState('');

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
                    <Breadcrumbs name={name} schemaNumber={schemaNumber} />
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
                                        patientID={props.history.location.state}
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
