import React from "react";
import "./SwitchBtn.css";

type SwitchBtnProps = {
  onChange: () => void;
  value: boolean;
  label: string;
  disabled?: boolean;
  testId?: string;
};

const SwitchBtn = ({
  onChange,
  value,
  label,
  disabled,
  testId,
}: SwitchBtnProps): React.JSX.Element => {
  return (
    <div className="switch-btn">
      <label>{label}</label>
      <label className="switch" aria-label={label}>
        <input
          title={label}
          type="checkbox"
          checked={value}
          onChange={onChange}
          disabled={disabled}
          data-testid={testId}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default SwitchBtn;
