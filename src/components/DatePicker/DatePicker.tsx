import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import CalImg from '../../images/icons/calendar-outline.svg';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

const Picker = () => {
    const [startDate, setStartDate] = useState<any>();
    return (
        <div className="datepicker">
            <DatePicker
                disabled
                placeholderText="dd.mm.åå"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
            />
            <img src={CalImg} alt="datepicker icon" height="25" />
        </div>
    );
};

export default Picker;
