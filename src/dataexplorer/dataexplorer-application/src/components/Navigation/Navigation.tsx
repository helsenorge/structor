import React from 'react';
import { Menu, Layout} from 'antd';
import 'antd/dist/antd.css';
import Dashboard from '../Dashboard/Dashboard'
import MineSkjema from '../MineSkjema/MineSkjema'
import MinePasienter from '../MinePasienter/MinePasienter'
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

// for (let index = 0; index < array.length; index++) {
//   const element = array[index];


// Function for generating elements dynamically. Doesnt work yet.
// const Generate = () => {
//   {data.items.map(({id, url, title}) => (
//       <Menu.Item key={id}> 
//         <Link to={url}> {title} </Link> 
//       </Menu.Item>
// ))}
// }

const Navigation = ({}) => (
  <React.Fragment>
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

        {/* <Menu.Item key="1">
        <Link to="/" > Hjem </Link>
        </Menu.Item>
        <Menu.Item key="2">
        <Link to="/skjema"> Mine Skjema </Link>
        </Menu.Item>
        <Menu.Item key="3">
        <Link to="/pasient"> Mine Pasienter </Link>
        </Menu.Item>
        <Menu.Item key="4">
            Søk
        </Menu.Item>
        <Menu.Item key="5">
            Filtrer
        </Menu.Item>   */}
      </Menu>
    </Sider>
    <Layout>
      <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
      <Content style={{ margin: '24px 16px 0' }}>
        <div className="content">
          <Switch>
            <Route  exact path={"/"} component={Dashboard} />
            <Route  exact path="/Skjema" component={MineSkjema} />
            <Route  exact path="/Pasient" component={MinePasienter} />
          </Switch>
        </div>
      </Content>
      <Footer />
    </Layout>
  </Layout>
  </React.Fragment>
)

export default withRouter(Navigation);