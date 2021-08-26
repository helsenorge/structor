import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState<Date>();
    return (
        <div className="datepicker">
            <DatePicker
                disabled={disabled}
                placeholderText={type === 'time' ? '00:00' : t('dd.mm.yyyy')}
                selected={selected || startDate}
                onChange={(date: Date) => {
                    setStartDate(date);
                    callback && callback(date);
                }}
                todayButton={nowButton ? t('Today') : undefined}
                withPortal={withPortal}
                locale="nb"
                showTimeSelect={type === 'time'}
                showTimeSelectOnly={type === 'time'}
                dateFormat={type === 'date' ? 'dd.MM.yyyy' : 'HH:mm'}
                timeCaption={t('Time')}
            />
            <i className={type === 'time' ? 'time-icon' : 'calendar-icon'} aria-label="datepicker" />
        </div>
    );
};

export default Picker;
