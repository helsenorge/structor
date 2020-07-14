import React, { useContext, useState } from 'react';
import { Col, Row, Button, TimePicker, DatePicker, Checkbox, Radio, Input } from 'antd';
import { FormContext, updateAnswer } from '../../store/FormStore';
import { ITime, TimeIntervalType } from '../../types/IAnswer';
import Moment from 'moment';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { RadioChangeEvent } from 'antd/lib/radio';
import './AnswerComponent.css';

type TimeProps = {
    questionId: string;
};

function Time({ questionId }: TimeProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [localAnswer, setLocalAnswer] = useState(state.questions[questionId].answer as ITime);
    const inputStyle = {
        width: '100px',
        padding: '8px',
        lineHeight: '1', 
    };

    function getTimeFormat(): string {
        if (localAnswer.isTime && localAnswer.isDate) return 'DD.MM.YYYY  HH:mm';
        else if (localAnswer.isDate) return 'DD.MM.YYYY';
        else return 'HH:mm';
    }

    function localUpdate(localAnswer: ITime, updateStore: boolean) {
        setLocalAnswer(localAnswer);
        if (updateStore) dispatch(updateAnswer(questionId, localAnswer));
    }

    function changeTimeType(isDate: boolean, isTime: boolean) {
        const tmp = { ...localAnswer };
        tmp.isDate = isDate;
        tmp.isTime = isTime;
        if (tmp.hasStartTime) tmp.startTime = 0;
        if (tmp.hasEndTime) tmp.endTime = 0;
        setLocalAnswer(tmp);
        dispatch(updateAnswer(questionId, tmp));
    }

    function timePickerRenderer(
        disabled: boolean,
        value: Moment.Moment,
        updateTime: (value: Moment.Moment | null, dateString: string) => void,
    ) {
        if (localAnswer.isDate && localAnswer.isTime)
            return (
                <DatePicker
                    value={value}
                    format={getTimeFormat()}
                    onChange={updateTime}
                    showTime={true}
                    disabled={disabled}
                />
            );
        else if (localAnswer.isDate)
            return (
                <DatePicker
                    value={value}
                    format={getTimeFormat()}
                    onChange={updateTime}
                    showTime={false}
                    disabled={disabled}
                />
            );
        else if (localAnswer.isTime)
            return <TimePicker value={value} format={'HH:mm'} onChange={updateTime} disabled={disabled} />;
    }

    function timeDefToString(plural: boolean) {
        if (plural) return localAnswer.isTime && localAnswer.isDate ? 'dager' : localAnswer.isTime ? 'timer' : 'dager';
        return localAnswer.isTime && localAnswer.isDate ? 'tid' : localAnswer.isTime ? 'tid' : 'dag';
    }

    return (
        <>
            <Row className="standard">
                <Col span={24} style={{ marginBottom: '10px' }}>
                    <Button
                        type={localAnswer.isDate && !localAnswer.isTime ? 'primary' : 'default'}
                        onClick={() => changeTimeType(true, false)}
                    >
                        Dato
                    </Button>
                    <Button
                        type={!localAnswer.isDate && localAnswer.isTime ? 'primary' : 'default'}
                        onClick={() => changeTimeType(false, true)}
                    >
                        Tid
                    </Button>
                    <Button
                        type={localAnswer.isDate && localAnswer.isTime ? 'primary' : 'default'}
                        onClick={() => changeTimeType(true, true)}
                    >
                        Dato og Tid
                    </Button>
                </Col>
            </Row>
            {(localAnswer.isDate || localAnswer.isTime) && (
                <>
                    <Row>
                        <Col span={12} className="standard">
                            <Checkbox
                                checked={localAnswer.hasDefaultTime}
                                onChange={(e: CheckboxChangeEvent) => {
                                    const tmp = { ...localAnswer };
                                    tmp.hasDefaultTime = e.target.checked;
                                    localUpdate(tmp, true);
                                }}
                            >
                                Forhåndsvalgt
                            </Checkbox>
                        </Col>
                        <Col span={12} style={{ paddingTop: '8px' }}>
                            {timePickerRenderer(
                                !localAnswer.hasDefaultTime,
                                Moment(localAnswer.defaultTime),
                                (value, valueString) => {
                                    console.log(valueString);
                                    const tmp = { ...localAnswer };
                                    tmp.defaultTime = value?.valueOf();
                                    localUpdate(tmp, true);
                                },
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className="standard">
                            <Checkbox
                                checked={localAnswer.hasInterval}
                                onChange={(e: CheckboxChangeEvent) => {
                                    const tmp = { ...localAnswer };
                                    tmp.hasInterval = e.target.checked;
                                    localUpdate(tmp, true);
                                }}
                            >
                                Definer intervall for gyldige tidspunkt
                            </Checkbox>
                        </Col>
                    </Row>
                    {localAnswer.hasInterval && (
                        <>
                            <Row
                                style={{
                                    marginBottom: '20px',
                                    paddingLeft: '10px',
                                }}
                            >
                                <Col offset={1}>
                                    <Radio.Group
                                        name="radiogroup"
                                        value={localAnswer.timeIntervalType}
                                        onChange={(e: RadioChangeEvent) => {
                                            const tmp = { ...localAnswer };
                                            tmp.timeIntervalType = e.target.value;
                                            tmp.endTime =
                                                tmp.timeIntervalType === TimeIntervalType.FIXED
                                                    ? Moment().valueOf()
                                                    : 0;
                                            tmp.startTime =
                                                tmp.timeIntervalType === TimeIntervalType.FIXED
                                                    ? Moment().valueOf()
                                                    : 0;
                                            localUpdate(tmp, true);
                                        }}
                                    >
                                        <Row style={{ marginBottom: '10px' }}>
                                            <Radio value={TimeIntervalType.FIXED}>Faste tidspunkt</Radio>
                                        </Row>
                                        <Row>
                                            <Radio value={TimeIntervalType.FLOATING}>
                                                I forhold til tidspunktet skjemaet fylles ut
                                            </Radio>
                                        </Row>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            {localAnswer.timeIntervalType === TimeIntervalType.FIXED ? (
                                <>
                                    <Row>
                                        <Col offset={2} md={10} lg={6} className="standard">
                                            <Checkbox
                                                checked={localAnswer.hasStartTime}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    const tmp = {
                                                        ...localAnswer,
                                                    };
                                                    tmp.hasStartTime = e.target.checked;
                                                    localUpdate(tmp, true);
                                                }}
                                            >
                                                Start {timeDefToString(false)}
                                            </Checkbox>
                                        </Col>
                                        <Col span={10} style={{ paddingTop: '8px' }}>
                                            {timePickerRenderer(
                                                !localAnswer.hasStartTime,
                                                Moment(
                                                    localAnswer.startTime ? localAnswer.startTime : Moment().valueOf(),
                                                ),
                                                (value) => {
                                                    const tmp = {
                                                        ...localAnswer,
                                                    };
                                                    tmp.startTime = value?.valueOf();
                                                    localUpdate(tmp, true);
                                                },
                                            )}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col offset={2} md={10} lg={6} className="standard">
                                            <Checkbox
                                                checked={localAnswer.hasEndTime}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    const tmp = {
                                                        ...localAnswer,
                                                    };
                                                    tmp.hasEndTime = e.target.checked;
                                                    localUpdate(tmp, true);
                                                }}
                                            >
                                                Slutt {timeDefToString(false)}
                                            </Checkbox>
                                        </Col>
                                        <Col span={10} style={{ paddingTop: '8px' }}>
                                            {timePickerRenderer(
                                                !localAnswer.hasEndTime,
                                                Moment(localAnswer.endTime ? localAnswer.endTime : Moment().valueOf()),
                                                (value) => {
                                                    const tmp = {
                                                        ...localAnswer,
                                                    };
                                                    tmp.endTime = value?.valueOf();
                                                    localUpdate(tmp, true);
                                                },
                                            )}
                                        </Col>
                                    </Row>
                                </>
                            ) : localAnswer.timeIntervalType === TimeIntervalType.FLOATING ? (
                                <>
                                    <Row>
                                        <Col offset={2} md={14} lg={8} className="standard">
                                            <Checkbox
                                                checked={localAnswer.hasStartTime}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    const tmp = {
                                                        ...localAnswer,
                                                    };
                                                    tmp.hasStartTime = e.target.checked;
                                                    localUpdate(tmp, true);
                                                }}
                                            >
                                                Antall {timeDefToString(true)} før:
                                            </Checkbox>
                                        </Col>
                                        <Col span={6}>
                                            <Input
                                                defaultValue={localAnswer.startTime}
                                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                    const tmp = {
                                                        ...localAnswer,
                                                    };
                                                    tmp.startTime = parseInt(e.target.value ? e.target.value : '');
                                                    localUpdate(tmp, true);
                                                }}
                                                disabled={!localAnswer.hasStartTime}
                                                style={inputStyle}
                                            ></Input>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col offset={2} md={14} lg={8} className="standard">
                                            <Checkbox
                                                checked={localAnswer.hasEndTime}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    const tmp = {
                                                        ...localAnswer,
                                                    };
                                                    tmp.hasEndTime = e.target.checked;
                                                    localUpdate(tmp, true);
                                                }}
                                            >
                                                Antall {timeDefToString(true)} etter:
                                            </Checkbox>
                                        </Col>
                                        <Col span={6}>
                                            <Input
                                                defaultValue={localAnswer.endTime}
                                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                    const tmp = {
                                                        ...localAnswer,
                                                    };
                                                    tmp.endTime = parseInt(e.target.value ? e.target.value : '');
                                                    localUpdate(tmp, true);
                                                }}
                                                disabled={!localAnswer.hasEndTime}
                                                style={inputStyle}
                                            ></Input>
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <> </>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}
export default Time;
