import React from "react";
import { Input } from "antd";
import "./QuestionComponents.css";

function TitleInput() {
  return (
    <div style={{ width: "60%", display: "inline-block", padding: "5px" }}>
      <Input className="inputQuestion" size="large" placeholder="Tittel..." />
    </div>
  );
}

export default TitleInput;
