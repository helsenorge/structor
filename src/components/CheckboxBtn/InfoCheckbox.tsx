import React from 'react';
import './CheckboxBtn.css';

type CheckboxBtnProps = {
    checked: boolean;
    label: string;
};

const InfoCheckbox = ({ checked, label }: CheckboxBtnProps): JSX.Element => {
    return (
        <div className="switch-btn">
            <label className="checkbox-container">
                <div className="disabled">{label}</div>
                <input type="checkbox" checked={checked} disabled={true} />
                <span className="checkmark"></span>
            </label>
        </div>
    );
};

export default InfoCheckbox;
