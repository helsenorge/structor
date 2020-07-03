import React, { useContext, useState } from 'react';
import { TimePicker, DatePicker, Checkbox, Button } from 'antd';
import './AnswerComponent.css';
import moment from 'moment';
import { FormContext } from 'antd/lib/form/context';
import { updateAnswer } from '../../store/FormStore';

const RangePicker = DatePicker.RangePicker;

type TimeProps = {
    questionId: string;
};
// TODO: This component does not support having a range of datetime at the moment
function Time({ questionId }: TimeProps): JSX.Element {
    const { state, dispatch } = useContext(FormContext);
    const [localAnswer, setLocalAnswer] = useState(
        state.questions[questionId].answer,
    );
    function getTimeFormat(): string {
        if (localAnswer.isTime && localAnswer.isDate)
            return 'DD.MM.YYYY  HH:mm';
        else if (localAnswer.isDate) return 'DD.MM.YYYY';
        else return 'HH:mm';
    }

    function localUpdate(attribute: {
        isTime?: boolean;
        isDate?: boolean;
        hasDefaultTime?: boolean;
        hasStartTime?: boolean;
        hasEndTime?: boolean;
        defaultTime?: string;
        startTime?: string;
        endTime?: string;
        updateStore?: boolean;
    }) {
        const temp = { ...localAnswer };
        if (attribute.isTime) temp.isLong = attribute.isTime;
        if (attribute.isDate) temp.isDate = attribute.isDate;
        if (attribute.defaultTime) temp.defaultTime = attribute.defaultTime;
        if (attribute.startTime) temp.startTime = attribute.startTime;
        if (attribute.endTime) temp.endTime = attribute.endTime;
        if (attribute.hasDefaultTime)
            temp.hasDefaultTime = attribute.hasDefaultTime;
        if (attribute.hasStartTime) temp.hasStartTime = attribute.hasStartTime;
        if (attribute.hasEndTime) temp.hasEndTime = attribute.hasEndTime;
        setLocalAnswer(temp);
        if (attribute.updateStore)
            dispatch(updateAnswer(questionId, localAnswer));
    }

    return (
        <>
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

            <Checkbox
                checked={localAnswer.hasDefaultTime}
                onChange={(e) =>
                    localUpdate({
                        hasDefaultTime: e.target.checked,
                        updateStore: true,
                    })
                }
            >
                Default time
            </Checkbox>
            {localAnswer.hasDefaultTime && (
                <DatePicker
                    disabled={true}
                    // showTime={localAnswer.isTime}
                    defaultValue={moment()}
                    format={getTimeFormat()}
                    onChange={(date, dateString) =>
                        localUpdate({ defaultTime: dateString })
                    }
                    onOk={() => localUpdate({ updateStore: true })}
                />
            )}
            <Checkbox
                checked={localAnswer.hasStartTime}
                onChange={(e) =>
                    localUpdate({
                        hasStartTime: e.target.checked,
                        updateStore: true,
                    })
                }
            >
                Start time
            </Checkbox>
            {localAnswer.hasStartTime && (
                <DatePicker
                    disabled={true}
                    // showTime={localAnswer.isTime}
                    defaultValue={moment()}
                    format={getTimeFormat()}
                    onChange={(date, dateString) =>
                        localUpdate({ defaultTime: dateString })
                    }
                    onOk={() => localUpdate({ updateStore: true })}
                />
            )}
            <Checkbox
                checked={localAnswer.hasEndTime}
                onChange={(e) =>
                    localUpdate({
                        hasEndTime: e.target.checked,
                        updateStore: true,
                    })
                }
            >
                End time
            </Checkbox>
            {localAnswer.hasEndeTime && (
                <DatePicker
                    disabled={true}
                    // showTime={localAnswer.isTime}
                    defaultValue={moment()}
                    format={getTimeFormat()}
                    onChange={(date, dateString) =>
                        localUpdate({ defaultTime: dateString })
                    }
                    onOk={() => localUpdate({ updateStore: true })}
                />
            )}
        </>
    );
}

export default Time;
