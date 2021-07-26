import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState<Date>();
    return (
        <div className="datepicker">
            <DatePicker
                disabled={disabled}
                placeholderText={t('dd.mm.åååå 00:00')}
                selected={selected || startDate}
                onChange={(date: Date) => {
                    setStartDate(date);
                    callback && callback(date);
                }}
                todayButton={nowButton ? t('I dag') : undefined}
                withPortal={withPortal}
                timeIntervals={15}
                locale="nb"
                showTimeSelect
                dateFormat="dd.MM.yyyy HH:mm"
                timeCaption={t('Klokkeslett')}
            />
            <i className="calendar-icon" aria-label="date and time picker" />
        </div>
    );
};

export default DateTimePicker;
