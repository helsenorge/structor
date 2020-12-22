import React from 'react';
import './Btn.css';

type BtnProps = {
    title: string;
    onClick?: () => void;
    id?: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
    icon?: 'ion-plus-round' | 'ion-ios-cloud-upload-outline';
    variant?: 'primary' | 'secondary';
};

const Btn = ({ title, onClick, id, type = 'button', icon, variant }: BtnProps): JSX.Element => {
    return (
        <button type={type} className={`regular-btn ${variant}`} id={id} onClick={onClick}>
            {icon && <i className={icon} />} {title}
        </button>
    );
};

export default Btn;
