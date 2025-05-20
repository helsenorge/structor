import React from "react";
import "./CheckboxBtn.css";

type CheckboxBtnProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  label: string;
  value: string;
  disabled?: boolean;
  testId?: string;
};

const CheckboxBtn = ({
  onChange,
  checked,
  label,
  value,
  disabled,
  testId,
}: CheckboxBtnProps): React.JSX.Element => {
  return (
    <div className="switch-btn">
      <label className="checkbox-container">
        {label}
        <input
          type="checkbox"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          data-testid={testId}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default CheckboxBtn;
