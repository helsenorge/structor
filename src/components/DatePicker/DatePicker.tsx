import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Calendar from '../../images/icons/calendar-outline.svg';
import Clock from '../../images/icons/time-outline.svg';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

type PickerProps = {
    type?: 'date' | 'time';
};

const Picker = ({ type }: PickerProps): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [startDate, setStartDate] = useState<any>();
    return (
        <div className="datepicker">
            <DatePicker
                disabled
                placeholderText={type === 'time' ? '00:00' : 'dd.mm.åå'}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
            />
            <img src={type === 'time' ? Clock : Calendar} alt="datepicker icon" height="25" />
        </div>
    );
};

export default Picker;
