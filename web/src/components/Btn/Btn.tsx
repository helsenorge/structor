import React from 'react';
import './Btn.css';

type BtnProps = {
    title: string;
    disabled: boolean;
    onClick?: () => void;
    id?: string;
    type?: 'button' | 'submit' | 'reset';
    icon?: 'ion-plus-round' | 'ion-ios-trash';
    variant?: 'primary' | 'secondary' | 'disabled';
};

const Btn = ({ title, onClick, id, type = 'button', icon, variant, disabled }: BtnProps): React.JSX.Element => {
    return (
        <button type={type} className={`regular-btn ${variant}`} id={id} onClick={onClick} disabled={disabled}>
            {icon && <i className={icon} />} {title}
        </button>
    );
};

export default Btn;
