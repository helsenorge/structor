import React from 'react';
import { Button } from "antd";
import { ActionButton } from '@helsenorge/toolkit/components/atoms/buttons/action-button'
import { useHistory } from "react-router-dom";


function Index() {
  let history = useHistory();

  function handleClick() {
    history.push('/create-form');
  }

  return (
    <div style={{height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
      <h1>Skjemautfyller</h1>
      <div>
        <ActionButton
          onClick={() => {
            handleClick()
          }}
        >
          {'Lag skjema'}
        </ActionButton>
      </div>
    </div>
  );
}

export default Index;
