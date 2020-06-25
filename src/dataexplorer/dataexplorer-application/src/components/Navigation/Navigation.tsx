import React from 'react';
import { Layout, Avatar } from 'antd';
import Breadcrumbs from './Breadcrumbs';
import 'antd/dist/antd.css';
import MySchemas from '../MySchemas/MySchemas';
import MyPatients from '../MyPatients/MyPatients';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import ListView from '../PatientInfo/ListView/ListView';
import SchemaView from 'components/MyPatients/SchemaView/SchemaView';
import { UserOutlined } from '@ant-design/icons';
import PatientInfo from '../MyPatients/PatientInfo/PatientInfo';

const { Header, Content } = Layout;

const Navigation = (props: any) => (
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
                        path={props.history}
                        style={{ flexGrow: 2, paddingLeft: 20 }}
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
                            // src="https://i.pinimg.com/236x/6c/ab/cc/6cabccf7f0ebb599cb4fd1dd783877dd--wallpaper-house-gregory-house.jpg"
                            icon={<UserOutlined />}
                        />
                        <h1 style={{ margin: 0, marginRight: -40 }}>
                            Dr. Gregory House
                        </h1>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'hidden' }}>
                    <div className="content">
                        <Switch>
                            <Route exact path="/Skjema" component={MySchemas} />
                            <Route exact path="/" component={MyPatients} />
                            <Route
                                exact
                                path="/PasientInfo"
                                component={PatientInfo}
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

export default withRouter(Navigation);
