import React from 'react';
import './IconBtn.css';

type IconBtnProps = {
    type?: 'back' | 'x';
    title?: string;
};

const IconBtn = ({ type, title }: IconBtnProps) => {
    let icon = '';

    switch (type) {
        case 'back': {
            icon = 'ion-ios-arrow-back';
            break;
        }
        default:
            icon = 'ion-close-round';
    }

    return (
        <button className="iconBtn" title={title}>
            <i className={icon} />
        </button>
    );
};

export default IconBtn;
