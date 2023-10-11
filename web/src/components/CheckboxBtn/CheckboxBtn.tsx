import React from 'react';
import './CheckboxBtn.css';

type CheckboxBtnProps = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    checked: boolean;
    label: string;
    value: string;
    disabled?: boolean;
};

const CheckboxBtn = ({ onChange, checked, label, value, disabled }: CheckboxBtnProps): JSX.Element => {
    return (
        <div className="switch-btn">
            <label className="checkbox-container">
                {label}
                <input type="checkbox" value={value} checked={checked} onChange={onChange} disabled={disabled} />
                <span className="checkmark"></span>
            </label>
        </div>
    );
};

export default CheckboxBtn;
