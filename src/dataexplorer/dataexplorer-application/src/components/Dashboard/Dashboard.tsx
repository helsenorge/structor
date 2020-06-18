<<<<<<< HEAD
import React from 'react';

const Dashboard = () => {
    return <div>Hei</div>;
=======
import React from "react";
import { Card, Row, Col} from "antd";
import Search from "antd/lib/input/Search";

const Dashboard = () => {
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a blandit quam. Vestibulum metus nisi, imperdiet in nunc sed, tempus feugiat velit. Integer ut congue lectus, at semper neque. Aeneansit amet, iaculis ac neque."
  return(
    <React.Fragment>
      <Row gutter={[60, 40]} justify={"center"}>
      <Col span={300}>
        <Search placeholder="Finn et Skjema!" enterButton />
      </Col>
      </Row>
      <Row style={{paddingTop: 100}}/>
      <Row gutter={[105, 105]} justify={"center"}>
      <Col span={8}>
        <Card title="Mottatte Skjema" hoverable> 
          <p>Velkommen tilbake, Dr. House!</p>
          <p>Du har mottatt 7 nye skjemabesvarelser. Klikk her for å lese disse.</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Andre spennende ting" hoverable bordered> {lorem} </Card>
      </Col>
      </Row>
    </React.Fragment>
  ) 
>>>>>>> Dashboard component
};

export default Dashboard;
