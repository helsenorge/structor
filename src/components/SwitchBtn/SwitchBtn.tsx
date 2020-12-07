import React from 'react';
import './SwitchBtn.css';

type SwitchBtnProps = {
    onClick: () => void;
    value: boolean;
    label: string;
};

const SwitchBtn = ({ onClick, value, label }: SwitchBtnProps) => {
    return (
        <div className="switch-btn">
            <label>{label}</label>
            <label className="switch">
                <input type="checkbox" checked={value} onClick={onClick} />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default SwitchBtn;
