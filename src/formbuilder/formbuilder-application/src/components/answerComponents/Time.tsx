import React, { useContext, useState } from 'react';
import { TimePicker, DatePicker, Checkbox, Button, Row, Col } from 'antd';
import './AnswerComponent.css';
import moment from 'moment';
import { updateAnswer, FormContext } from '../../store/FormStore';
import { ITime } from '../../types/IAnswer';

type TimeProps = {
    questionId: string;
};
// TODO: This component does not support having a range of datetime at the moment
function Time({ questionId }: TimeProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [localAnswer, setLocalAnswer] = useState(
        state.questions[questionId].answer as ITime,
    );
    function getTimeFormat(): string {
        if (localAnswer.isTime && localAnswer.isDate)
            return 'DD.MM.YYYY  HH:mm';
        else if (localAnswer.isDate) return 'DD.MM.YYYY';
        else return 'HH:mm';
    }

    function getType(): string {
        if (localAnswer.isTime && localAnswer.isDate) return 'dateTime';
        else if (!localAnswer.isTime && localAnswer.isDate) return 'date';
        else return 'time';
    }

    function localUpdate(attribute: {
        isTime?: boolean;
        isDate?: boolean;
        hasDefaultTime?: boolean;
        hasStartTime?: boolean;
        hasEndTime?: boolean;
        defaultTime?: number;
        startTime?: number;
        endTime?: number;
        updateStore?: boolean;
    }) {
        const temp = { ...localAnswer };
        console.log(attribute);
        if (attribute.isTime !== undefined) temp.isTime = attribute.isTime;
        if (attribute.isDate !== undefined) temp.isDate = attribute.isDate;
        if (attribute.defaultTime !== undefined)
            temp.defaultTime = attribute.defaultTime;
        if (attribute.startTime !== undefined) {
            temp.startTime = attribute.startTime;
        }
        if (attribute.endTime !== undefined) {
            temp.endTime = attribute.endTime;
        }
        if (attribute.hasDefaultTime !== undefined)
            temp.hasDefaultTime = attribute.hasDefaultTime;
        if (attribute.hasStartTime !== undefined)
            temp.hasStartTime = attribute.hasStartTime;
        if (attribute.hasEndTime !== undefined)
            temp.hasEndTime = attribute.hasEndTime;
        setLocalAnswer(temp);
        if (attribute.updateStore !== undefined)
            dispatch(updateAnswer(questionId, temp));
    }

    function dateRenderer(key: string) {
        const updateObject = { updateStore: true };
        let temp = '';
        switch (key) {
            case 'defaultTime':
                temp = 'hasDefaultTime';
                break;
            case 'startTime':
                temp = 'hasStartTime';
                break;
            case 'endTime':
                temp = 'hasEndTime';
                break;
        }
        switch (getType()) {
            case 'time':
                return (
                    <TimePicker
                        // value={localAnswer[key])}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        value={localAnswer[key] ? moment(localAnswer[key]) : ''}
                        format={'HH:mm'}
                        onChange={(date, dateString) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            updateObject[key] = moment(date).valueOf();
                            localUpdate(updateObject);
                        }}
                        disabled={eval('!localAnswer.' + temp)}
                    />
                );
            case 'dateTime':
                return (
                    <DatePicker
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        // defaultValue={moment(localAnswer[key], getTimeFormat())}
                        value={localAnswer[key] ? moment(localAnswer[key]) : ''}
                        format={'DD.MM.YYYY HH:mm'}
                        onChange={(date, dateString) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            updateObject[key] = moment(date).valueOf();
                            localUpdate(updateObject);
                        }}
                        showTime={localAnswer.isTime}
                        disabled={eval('!localAnswer.' + temp)}
                    />
                );
            case 'date':
                return (
                    <DatePicker
                        // defaultValue={moment()}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        value={localAnswer[key] ? moment(localAnswer[key]) : ''}
                        format={getTimeFormat()}
                        onChange={(date, dateString) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            updateObject[key] = moment(date).valueOf();
                            localUpdate(updateObject);
                        }}
                        showTime={localAnswer.isTime}
                        disabled={eval('!localAnswer.' + temp)}
                    />
                );
            default:
                break;
        }
    }
    return (
        <>
            <Row className="standard">
                <Col span={24} style={{ marginBottom: '10px' }}>
                    <Button
                        type={
                            localAnswer.isDate && !localAnswer.isTime
                                ? 'primary'
                                : undefined
                        }
                        onClick={() =>
                            localUpdate({
                                isDate: true,
                                isTime: false,
                            })
                        }
                    >
                        Dato
                    </Button>
                    <Button
                        type={
                            !localAnswer.isDate && localAnswer.isTime
                                ? 'primary'
                                : undefined
                        }
                        onClick={() =>
                            localUpdate({
                                isDate: false,
                                isTime: true,
                            })
                        }
                    >
                        Tid
                    </Button>
                    <Button
                        type={
                            localAnswer.isDate && localAnswer.isTime
                                ? 'primary'
                                : undefined
                        }
                        onClick={() =>
                            localUpdate({
                                isDate: true,
                                isTime: true,
                            })
                        }
                    >
                        Dato og Tid
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Row className="standard">
                        <Col span={12} style={{ marginBottom: '10px' }}>
                            <Checkbox
                                checked={localAnswer.hasDefaultTime}
                                onChange={(e) =>
                                    localUpdate({
                                        hasDefaultTime: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Forhåndsvalgt
                            </Checkbox>
                        </Col>
                        <Col span={12}>{dateRenderer('defaultTime')}</Col>
                    </Row>
                    <Row className="standard">
                        <Col span={12} style={{ marginBottom: '10px' }}>
                            <Checkbox
                                checked={localAnswer.hasStartTime}
                                onChange={(e) =>
                                    localUpdate({
                                        hasStartTime: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Start
                            </Checkbox>
                        </Col>
                        <Col span={12}>{dateRenderer('startTime')}</Col>
                    </Row>
                    <Row className="standard">
                        <Col span={12} style={{ marginBottom: '10px' }}>
                            <Checkbox
                                checked={localAnswer.hasEndTime}
                                onChange={(e) =>
                                    localUpdate({
                                        hasEndTime: e.target.checked,
                                        updateStore: true,
                                    })
                                }
                            >
                                Slutt
                            </Checkbox>
                        </Col>
                        <Col span={12}>{dateRenderer('endTime')}</Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default Time;
