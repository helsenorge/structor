import React, { useState, useContext } from 'react';
import { Row, Col, Button } from 'antd';
import NavBar from '../components/commonComponents/NavBar';
import SectionRenderer from '../components/Section';
import { FormContext, addNewSection, removeSection } from '../store/FormStore';
//import * as DND from 'react-beautiful-dnd';
import './Form.css';

function CreateForm(): JSX.Element {
    const [i, setI] = useState(0);
    const { state, dispatch } = useContext(FormContext);

    function dispatchAddNewSection(index?: number) {
        setI(i + 1);
        try {
            if (index && !state.sections[index]) {
                dispatch(addNewSection(index));
            } else {
                dispatch(addNewSection(i + 1));
            }
        } catch (e) {
            console.log(e);
        }
    }

    // function onDragEnd(sections: SectionList, result: DND.DropResult) {
    //     setSections(Form.onDragEnd(sections, result));
    // }

    return (
        <>
            <div>
                <Row>
                    <Col span={24}>
                        <NavBar />
                    </Col>
                </Row>
                <Row style={{ margin: '61px 0 0 0' }}>
                    <Col span={24}>
                        <div
                            style={{ display: 'inline', position: 'relative' }}
                        >
                            {state &&
                                state.sections &&
                                Object.keys(state.sections).map(
                                    (sectionId: string) => {
                                        console.log(sectionId);
                                        const section =
                                            state.sections[parseInt(sectionId)];
                                        return (
                                            <SectionRenderer
                                                key={'section' + section.id}
                                                sectionId={section.id}
                                                removeSection={() =>
                                                    dispatch(
                                                        removeSection(
                                                            section.id,
                                                        ),
                                                    )
                                                }
                                            />
                                        );
                                    },
                                )}
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
                                onClick={() => dispatchAddNewSection()}
                            >
                                Legg til ny seksjon
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default CreateForm;
