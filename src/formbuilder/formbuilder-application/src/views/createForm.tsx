import React from 'react';
import { FunctionButton } from '@helsenorge/toolkit/components/atoms/buttons/function-button';


function CreateForm() {
  return (
    <div style={{height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
    <h1>Overskrift</h1>
    <div style={{display:"inline-block"}}>
    <FunctionButton
      iconType="add"
      onClick={() => {
        /* tom */
      }}
    >
      {}
    </FunctionButton>
      </div>
</div>
  );
}

export default CreateForm;


