import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/formBuilder/NavBar';
import Section from '../components/formBuilder/Section';
import './createForm.css';

function CreateForm(): JSX.Element {
    
    const [i, setI] = useState(0);
    const [sections, setSections] = useState([0]);
    
    function addNewSection(){
        sections.push(i+1);
        setSections(sections);
        setI(i+1);
    }

    function removeSection (id: number) {
        setSections(sections.filter(index => index !== id));
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <NavBar/>
                </Col>
            </Row>
            <Row style={{margin:'61px 0 0 0'}}>
                <Col span={24}>       
                    <div style={{display:'inline', position:'relative'}}>  
                        { sections.map((section) => [
                            <Section key={section} id={section} removeSection={()=>removeSection(section)} />
                        ])}
                    </div>
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
