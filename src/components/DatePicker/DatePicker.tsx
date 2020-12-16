import React, { useState } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { nb } from 'date-fns/locale';

import Calendar from '../../images/icons/calendar-outline.svg';
import Clock from '../../images/icons/time-outline.svg';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

type PickerProps = {
    type?: 'date' | 'time';
    disabled?: boolean;
    withPortal?: boolean;
    callback?: (date: Date) => void;
    selected?: Date;
};

setDefaultLocale('nb');
registerLocale('nb', nb);

const Picker = ({ type, disabled = true, withPortal, callback, selected }: PickerProps): JSX.Element => {
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
                withPortal={withPortal}
                locale="nb"
                showTimeSelect={type === 'time'}
                showTimeSelectOnly={type === 'time'}
                dateFormat={type === 'date' ? 'dd.MM.yyyy' : 'HH:mm'}
            />
            <img src={type === 'time' ? Clock : Calendar} alt="datepicker icon" height="25" />
        </div>
    );
};

export default Picker;
