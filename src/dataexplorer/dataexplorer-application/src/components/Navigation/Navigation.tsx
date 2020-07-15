import React from 'react';
import { Layout } from 'antd';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Dashboard from '../Dashboard/Dashboard';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import Patient from '../Patient/Patient';
import QuestionnaireResponse from 'components/QuestionnaireResponse/QuestionnaireResponse';
import 'antd/dist/antd.css';
import './Navigation.style.scss';
import CompareQuestionnaireResponses from 'components/CompareQuestionnaireResponses/CompareQuestionnaireResponses';

const { Header, Content } = Layout;
const Navigation = () => {
    return (
        <>
            <Layout>
                <Header className="site-layout-sub-header-background">
                    <Link to="/">
                        <h1>Datautforskeren</h1>
                    </Link>

                    <div className="avatar-container">
                        <h1>Dr. Gregory House</h1>
                    </div>
                </Header>
                <Header>
                    <div className="breadcrumb-container">
                        <Breadcrumbs />
                    </div>
                </Header>

                <Content>
                    <div className="content">
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route exact path="/pasient" component={Patient} />
                            <Route exact path="/pasient/skjema" component={QuestionnaireResponse} />
                            <Route
                                exact
                                path="/pasient/skjema-sammenligning"
                                component={CompareQuestionnaireResponses}
                            />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </>
    );
};

export default withRouter(Navigation);
