import React from 'react';
import { TimePicker, DatePicker } from 'antd';
import './AnswerComponent.css';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;

type DateProps = {
    required?: boolean;
    isRange?: boolean;
    isDate?: boolean;
    isTime?: boolean;
};

function Date({ isDate, isTime, isRange = false }: DateProps): JSX.Element {
    function dateType(): JSX.Element {
        switch (true) {
            case isDate && isTime:
                // Return DateTime picker
                return <DatePicker showTime format="DD.MM.YYYY HH:mm" />;
            case isDate && !isTime:
                if (isRange) {
                    //Retrun RangePicker
                    return (
                        <RangePicker
                            format="DD.MM.YYYY"
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
                            format="DD.MM.YYYY"
                            defaultValue={moment('24.06.2020', 'DD.MM.YYYY')}
                        />
                    );
                }
            case !isDate && isTime:
                // Return TimePicker
                return <TimePicker format={'HH:mm'} />;
            default:
                return <div></div>;
        }
    }
    return dateType();
}

export default Date;
