import React from 'react';
import './IconBtn.css';

type IconBtnProps = {
    type?: 'back' | 'forward' | 'x';
    title?: string;
    onClick?: () => void;
};

const IconBtn = ({ type, title, onClick }: IconBtnProps): JSX.Element => {
    let icon = '';

    switch (type) {
        case 'back': {
            icon = 'ion-ios-arrow-back';
            break;
        }
        case 'forward': {
            icon = 'ion-ios-arrow-forward';
            break;
        }
        default:
            icon = 'ion-close-round';
    }

    return (
        <button className="iconBtn" title={title} onClick={onClick}>
            <i className={icon} />
        </button>
    );
};

export default IconBtn;
