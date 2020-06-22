import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/formBuilder/NavBar';
import Section from '../types/Section';
import Form from '../types/Form';
import { SectionList } from '../types/Form';
import * as DND from 'react-beautiful-dnd';
import './createForm.css';

function CreateForm(): JSX.Element {
    const initList: SectionList = { 0: new Section(0) };

    const [i, setI] = useState(0);
    const [sections, setSections] = useState(initList);

    function addNewSection(index?: number) {
        setI(i + 1);
        if (index && !sections[index]) {
            setSections(Form.addSection(sections, index));
        } else {
            setSections(Form.addSection(sections, i));
        }
    }

    function removeSection(index: number) {
        setSections(Form.removeSection(sections, index));
    }

    function onDragEnd(sections: SectionList, result: DND.DropResult) {
        setSections(Form.onDragEnd(sections, result));
    }

    return (
        <div
            style={{
                backgroundColor: 'var(--color-base-2)',
                height: '100vh',
            }}
        >
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
                                <Section
                                    key={section.id}
                                    id={section.id}
                                    removeSection={() => removeSection(section.id)}
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
                            onClick={addNewSection}
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
