import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

import React, { useState } from "react";

import { nb } from "date-fns/locale";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";

type DateTimePickerProps = {
  disabled?: boolean;
  nowButton?: boolean;
  callback?: (date: Date) => void;
  selected?: Date;
};

setDefaultLocale("nb");
registerLocale("nb", nb);

const DateTimePicker = ({
  disabled = true,
  callback,
  nowButton,
  selected,
}: DateTimePickerProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Date>();
  return (
    <div className="datepicker">
      <DatePicker
        disabled={disabled}
        placeholderText={t("dd.mm.yyyy 00:00")}
        selected={selected || startDate}
        onChange={(date: Date) => {
          setStartDate(date);
          callback && callback(date);
        }}
        todayButton={nowButton ? t("Today") : undefined}
        timeIntervals={15}
        locale="nb"
        showTimeSelect
        dateFormat="dd.MM.yyyy HH:mm"
        timeCaption={t("Time")}
      />
      <i className="calendar-icon" aria-label="date and time picker" />
    </div>
  );
};

export default DateTimePicker;
