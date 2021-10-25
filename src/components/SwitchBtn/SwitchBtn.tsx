import React from 'react';
import './SwitchBtn.css';

type SwitchBtnProps = {
    onChange: () => void;
    value: boolean;
    label: string;
    disabled?: boolean;
};

const SwitchBtn = ({ onChange, value, label, disabled }: SwitchBtnProps): JSX.Element => {
    return (
        <div className="switch-btn">
            <label>{label}</label>
            <label className="switch">
                <input type="checkbox" checked={value} onChange={onChange} disabled={disabled} />
                <span className="slider"></span>
            </label>
        </div>
    );
};

export default SwitchBtn;
