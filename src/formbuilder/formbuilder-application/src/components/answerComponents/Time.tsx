import React from 'react';
import { TimePicker, DatePicker } from 'antd';
import './AnswerComponent.css';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;

type DateProps = {
    isRange?: boolean;
    isDate?: boolean;
    isTime?: boolean;
};
// TODO: This component does not support having a range of datetime at the moment
function Time({ isDate, isTime, isRange = false }: DateProps): JSX.Element {
    function dateType(): JSX.Element {
        switch (true) {
            case isDate && isTime:
                // Return DateTime picker
                return (
                    <DatePicker
                        disabled={true}
                        showTime
                        defaultValue={moment(
                            '24.06.2020.14.15',
                            'DD.MM.YYYY.HH.mm',
                        )}
                        format="DD.MM.YYYY HH:mm"
                    />
                );
            case isDate && !isTime:
                if (isRange) {
                    //Retrun RangePicker
                    return (
                        <RangePicker
                            format="DD.MM.YYYY"
                            disabled={true}
                            defaultValue={[
                                moment('23.06.2020', 'DD.MM.YYYY'),
                                moment('28.06.2020', 'DD.MM.YYYY'),
                            ]}
                        />
                    );
                } else {
                    return (
                        // Return DatePicker
                        <DatePicker
                            disabled={true}
                            format="DD.MM.YYYY"
                            defaultValue={moment('24.06.2020', 'DD.MM.YYYY')}
                        />
                    );
                }
            case !isDate && isTime:
                // Return TimePicker
                return (
                    <TimePicker
                        disabled={true}
                        defaultValue={moment('14:25', 'HH:mm')}
                        format={'HH:mm'}
                    />
                );
            default:
                return <div></div>;
        }
    }
    return dateType();
}

export default Time;
