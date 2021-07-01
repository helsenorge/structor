import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import React, { useState } from 'react';

import { nb } from 'date-fns/locale';

type DateTimePickerProps = {
    disabled?: boolean;
    withPortal?: boolean;
    nowButton?: boolean;
    callback?: (date: Date) => void;
    selected?: Date;
};

setDefaultLocale('nb');
registerLocale('nb', nb);

const DateTimePicker = ({
    disabled = true,
    withPortal,
    callback,
    nowButton,
    selected,
}: DateTimePickerProps): JSX.Element => {
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
                todayButton={nowButton ? 'I dag' : undefined}
                withPortal={withPortal}
                timeIntervals={15}
                locale="nb"
                showTimeSelect
                dateFormat="dd.MM.yyyy HH:mm"
                timeCaption="Klokkeslett"
            />
            <i className="calendar-icon" aria-label="date and time picker" />
        </div>
    );
};

export default DateTimePicker;
