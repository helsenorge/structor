import React from 'react';
import './CheckboxBtn.css';

type CheckboxBtnProps = {
    onChange: () => void;
    value: boolean;
    label: string;
    disabled?: boolean;
};

const CheckboxBtn = ({ onChange, value, label, disabled }: CheckboxBtnProps): JSX.Element => {
    return (
        <div className="switch-btn">
            <label className="container">
                {label}
                <input type="checkbox" checked={value} onChange={onChange} disabled={disabled} />
                <span className="checkmark"></span>
            </label>
        </div>
    );
};

export default CheckboxBtn;
