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
            <Row className="standard">
                <Col span={24} style={{ marginBottom: '10px' }}>
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
                    {localAnswer.hasDefaultTime && dateRenderer('defaultTime')}
                </Col>
            </Row>
            <Row className="standard">
                <Col span={24} style={{ marginBottom: '10px' }}>
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
                    {localAnswer.hasStartTime && dateRenderer('startTime')}
                </Col>
            </Row>
            <Row className="standard">
                <Col span={24} style={{ marginBottom: '10px' }}>
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
                    {localAnswer.hasEndTime && dateRenderer('endTime')}
                </Col>
            </Row>
            <Button onClick={() => console.log(localAnswer.defaultTime)}>
                test
            </Button>
        </>
    );
}

export default Time;
