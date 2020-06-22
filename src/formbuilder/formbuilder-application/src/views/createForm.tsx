import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/formBuilder/NavBar';
import Section from '../types/Section';
import SectionRenderer from '../components/formBuilder/SectionRenderer';
import Form from '../types/Form';
import { SectionList } from '../types/Form';
import * as DND from 'react-beautiful-dnd';
import './createForm.css';

function CreateForm(): JSX.Element {
    const initList: SectionList = { 0: new Section(0) };

    const [i, setI] = useState(0);
    const [sections, setSections] = useState(initList);

    function addNewSection(index?: number) {
        console.log(i);
        setI(i + 1);
        console.log(i);
        if (index && !sections[index]) {
            setSections(Form.addSection(sections, index));
        } else {
            setSections(Form.addSection(sections, i + 1));
        }
    }

    function removeSection(index: number) {
        console.log(sections);
        setSections(Form.removeSection(sections, index));
        console.log(sections);
    }

    function onDragEnd(sections: SectionList, result: DND.DropResult) {
        setSections(Form.onDragEnd(sections, result));
    }

    return (
        <div>
            <Row>
                <Col span={24}>
                    <NavBar />
                </Col>
            </Row>
            <Row style={{ margin: '61px 0 0 0' }}>
                <Col span={24}>
                    <div style={{ display: 'inline', position: 'relative' }}>
                        {Object.keys(sections).map((sectionId: string) => {
                            const section = sections[parseInt(sectionId)];
                            return (
                                <SectionRenderer
                                    key={section.id}
                                    id={section.id}
                                    removeSection={() =>
                                        removeSection(section.id)
                                    }
                                />
                            );
                        })}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div
                        style={{
                            margin: '10px',
                            display: 'inline-block',
                        }}
                    >
                        <Button
                            className="section-button"
                            type="dashed"
                            ghost
                            size="large"
                            onClick={() => addNewSection()}
                        >
                            Legg til ny seksjon
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default CreateForm;
