import React from 'react';
import './SwitchBtn.css';

type SwitchBtnProps = {
    onChange: () => void;
    value: boolean;
    label: string;
    initial?: boolean;
    disabled?: boolean;
};

const SwitchBtn = ({ onChange, value, label, initial, disabled }: SwitchBtnProps): JSX.Element => {
    return (
        <div className={`switch-btn ${initial ? 'initial' : ''}`}>
            <label>{label}</label>
            <label className="switch">
                <input type="checkbox" checked={value} onChange={onChange} disabled={disabled} />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default SwitchBtn;
