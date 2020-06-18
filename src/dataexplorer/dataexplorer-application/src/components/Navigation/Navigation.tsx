import React from 'react';
import { Menu, Layout} from 'antd';
import 'antd/dist/antd.css';
import Dashboard from '../Dashboard/Dashboard'
import MySchemas from '../MySchemas/MySchemas'
import MyPatients from '../MyPatients/MyPatients'
import {Switch, Route, Link, withRouter } from 'react-router-dom'
import MenuItem from 'antd/lib/menu/MenuItem';

const { Header, Content, Sider, Footer} = Layout;
const data =
  {
  "items": [
    {
      "id": 1,
      "url": "/",
      "title": "Hjem"
    },
    {
      "id": 2,
      "url": "/Skjema",
      "title": "Mine Skjema"
    },
    {
      "id": 3,  
      "url": "/Pasient",
      "title": "Mine pasienter"
    },
    {
      "id": 4,
      "url": "/Search",
      "title": "Filtrer på egenskaper"
    },
  ]
  }

const Navigation = () => (
  <>
    <Layout>
    <Sider
      breakpoint="xs"
      collapsedWidth="0"
    >
      <div className="logo">
          <h1 style={{ color: 'white', paddingLeft: 20, paddingTop: 26}}>
            Datautforskeren
          </h1>
      </div>
      <Menu 
      theme="dark" 
      mode="inline" 
      defaultSelectedKeys={['1']}>
      
      {data.items.map(({id, url, title}) => (
        <MenuItem key={id}> 
          <Link to={url}> {title} </Link> 
        </MenuItem>
        ))}
      </Menu>
    </Sider>
    <Layout>
      <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0' }}>
        <div className="content">
          <Switch>
            <Route  exact path={"/"} component={Dashboard} />
            <Route  exact path="/Skjema" component={MySchemas} />
            <Route  exact path="/Pasient" component={MyPatients} />
          </Switch>
        </div>
      </Content>
      <Footer />
    </Layout>
  </Layout>
  </>
)

export default withRouter(Navigation);