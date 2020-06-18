import React from "react";
import { Button, Tooltip, Row, Col, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import "./NavBar.css";

const { Title } = Typography;

function NavBar() {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1,
        width: "100%",
        padding: "5px",
        height: "56px",
        display: "block",
        backgroundColor: "#006D84",
      }}
    >
      <Row>
        <Col span={1}>
          <Tooltip title="Tilbake">
            <Button
              style={{ margin: "5px", float: "left", color: "#FAFAFA" }}
              type="link"
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => window.history.back()}
            />
          </Tooltip>
        </Col>
        <Col span={17}>
          <Title level={2} style={{ color: "#FAFAFA", float: "left" }}>
            Skjemabygger
          </Title>
        </Col>
        <Col span={6}>
          <div style={{ float: "right" }}>
            <Button
              className="navButton"
              type="link"
              size="large"
              style={{ margin: "2px" }}
              key="previewForm"
            >
              Forhåndsvisning
            </Button>
            <Button
              className="navButton"
              type="link"
              size="large"
              style={{ margin: "2px 10px" }}
              key="saveForm"
            >
              Lagre
            </Button>
          </div>
        </Col>
      </Row>
    </div>

    /*
                <PageHeader
                    onBack={() => window.history.back()}
                    title="Skjemabygger"
                    extra={[
                        <Button key="previewForm">Forhåndsvisning</Button>,
                        <Button key="2">Lagre</Button>,
                    ]}
                    title-color="#FAFAFA"
                    style={{backgroundColor:"#006D84", color:"#FAFAFA"}}
                    ></PageHeader>
            */
  );
}

export default NavBar;
