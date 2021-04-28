import React from 'react';
import './IconBtn.css';

type IconBtnProps = {
    type?: 'back' | 'forward' | 'x' | 'info';
    title?: string;
    onClick?: () => void;
    color?: 'white' | 'black';
    size?: 'large';
};

const IconBtn = ({ type, title, onClick, color = 'white', size }: IconBtnProps): JSX.Element => {
    const classNames: Array<string> = ['iconBtn'];
    if (color) {
        classNames.push(color);
    }
    if (size) {
        classNames.push(size);
    }

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
        case 'info': {
            icon = 'ion-ios-information-outline';
            break;
        }
        default:
            icon = 'ion-close-round';
    }

    return (
        <button className={classNames.join(' ')} title={title} onClick={onClick}>
            <i className={icon} />
        </button>
    );
};

export default IconBtn;
