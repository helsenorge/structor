import React from 'react';
import './SwitchBtn.css';

type SwitchBtnProps = {
    onClick: () => void;
    value: boolean;
    label: string;
    initial?: boolean;
};

const SwitchBtn = ({ onClick, value, label, initial }: SwitchBtnProps): JSX.Element => {
    return (
        <div className={`switch-btn ${initial ? 'initial' : ''}`}>
            <label>{label}</label>
            <label className="switch">
                <input type="checkbox" defaultChecked={value} onClick={onClick} />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default SwitchBtn;
