import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

import React, { useState } from "react";

import { nb } from "date-fns/locale";
import ReactDatePicker, {
  registerLocale,
  setDefaultLocale,
} from "react-datepicker";
import { useTranslation } from "react-i18next";

type PickerProps = {
  type?: "date" | "time";
  disabled?: boolean;
  nowButton?: boolean;
  callback?: (date: Date) => void;
  selected?: Date;
};

setDefaultLocale("nb");
registerLocale("nb", nb);

const DatePicker = ({
  type,
  disabled = true,
  nowButton,
  callback,
  selected,
}: PickerProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Date>();
  return (
    <div className="datepicker">
      <ReactDatePicker
        disabled={disabled}
        placeholderText={type === "time" ? "00:00" : t("dd.mm.yyyy")}
        selected={selected || startDate}
        onChange={(date: Date) => {
          setStartDate(date);
          callback && callback(date);
        }}
        todayButton={nowButton ? t("Today") : undefined}
        locale="nb"
        showTimeSelect={type === "time"}
        showTimeSelectOnly={type === "time"}
        dateFormat={type === "date" ? "dd.MM.yyyy" : "HH:mm"}
        timeCaption={t("Time")}
      />
      <i
        className={type === "time" ? "time-icon" : "calendar-icon"}
        aria-label="datepicker"
      />
    </div>
  );
};

export default DatePicker;
