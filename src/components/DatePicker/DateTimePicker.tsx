import React, { useState } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { nb } from 'date-fns/locale';

import Calendar from '../../images/icons/calendar-outline.svg';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

type DateTimePickerProps = {
    disabled?: boolean;
    withPortal?: boolean;
    callback?: (date: Date) => void;
    selected?: Date;
};

setDefaultLocale('nb');
registerLocale('nb', nb);

const DateTimePicker = ({ disabled = true, withPortal, callback, selected }: DateTimePickerProps): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [startDate, setStartDate] = useState<any>();
    return (
        <div className="datepicker">
            <DatePicker
                disabled={disabled}
                placeholderText="dd.mm.åå 00:00"
                selected={selected || startDate}
                onChange={(date: Date) => {
                    setStartDate(date);
                    callback && callback(date);
                }}
                withPortal={withPortal}
                timeIntervals={15}
                locale="nb"
                showTimeSelect
                dateFormat="dd.MM.yyyy HH:mm"
                timeCaption="Tid"
            />
            <img src={Calendar} alt="datepicker icon" height="25" />
        </div>
    );
};

export default DateTimePicker;
