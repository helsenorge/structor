import React from 'react';
import './Btn.css';

type BtnProps = {
    title: string;
    onClick?: () => void;
    id?: string;
    type?: 'button' | 'submit' | 'reset';
    icon?: 'ion-plus-round' | 'ion-ios-cloud-upload-outline';
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'large';
};

const Btn = ({ title, onClick, id, type = 'button', icon, variant, size }: BtnProps): JSX.Element => {
    return (
        <button type={type} className={`regular-btn ${variant} ${size}`} id={id} onClick={onClick}>
            {icon && <i className={icon} />} {title}
        </button>
    );
};

export default Btn;
