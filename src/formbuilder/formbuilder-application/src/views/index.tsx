import React from 'react';
import { ActionButton } from '@helsenorge/toolkit/components/atoms/buttons/action-button';
import { Link } from "react-router-dom";


function Index() {
  return (
      <div style={{height:"100vh", width:"100vw", textAlign:"center"}}>
          <h1>Velkommen til skjemadesigneren</h1>
          <div style={{display:"inline-block"}}>
              <Link to="/create-form">
                <ActionButton 
                    onClick={() => {
                       console.log("trykket")
                    }} 
                >
                    {'Lag nytt spørreskjema'}
                </ActionButton>
            </Link>
            </div>
    </div>
  );
}

export default Index;
