import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import React, { useState } from 'react';

import Calendar from '../../images/icons/calendar-outline.svg';
import Clock from '../../images/icons/time-outline.svg';
import { nb } from 'date-fns/locale';

type PickerProps = {
    type?: 'date' | 'time';
    disabled?: boolean;
    withPortal?: boolean;
    nowButton?: boolean;
    callback?: (date: Date) => void;
    selected?: Date;
};

setDefaultLocale('nb');
registerLocale('nb', nb);

const Picker = ({ type, disabled = true, withPortal, nowButton, callback, selected }: PickerProps): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [startDate, setStartDate] = useState<any>();
    return (
        <div className="datepicker">
            <DatePicker
                disabled={disabled}
                placeholderText={type === 'time' ? '00:00' : 'dd.mm.åå'}
                selected={selected || startDate}
                onChange={(date: Date) => {
                    setStartDate(date);
                    callback && callback(date);
                }}
                todayButton={nowButton ? 'I dag' : undefined}
                withPortal={withPortal}
                locale="nb"
                showTimeSelect={type === 'time'}
                showTimeSelectOnly={type === 'time'}
                dateFormat={type === 'date' ? 'dd.MM.yyyy' : 'HH:mm'}
                timeCaption="Tid"
            />
            <img src={type === 'time' ? Clock : Calendar} alt="datepicker icon" height="25" />
        </div>
    );
};

export default Picker;
