import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/formBuilder/NavBar';
import Section from '../components/formBuilder/Section';
import './createForm.css';

function CreateForm(): JSX.Element {
    
    const [i, setI] = useState(0);
    const [sections, setSections] = useState([<Section key={i} id={i} />]);
    
    function addNewSection(){
        setI(i+1);
        setSections(sections => [...sections, <Section key={i+1} id={i+1} />]);
    }
    
    return (
        <div style={{ backgroundColor: 'var(--color-base-2)', height: '100vh' }}>
            <Row>
                <Col span={24}>
                    <NavBar/>
                </Col>
            </Row>
            <Row style={{margin:'61px 0 0 0'}}>
                <Col span={24}>
                    {sections}
                </Col>
            </Row>


            <Row>
                <Col span={24}>
                    <div style={{
                         margin: '10px',
                         display: 'inline-block'
                    }}>
                        <Button className="section-button" type="dashed" ghost size="large" onClick={addNewSection}>
                            Legg til ny seksjon
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default CreateForm;
