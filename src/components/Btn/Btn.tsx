import React from 'react';
import './Btn.css';

type BtnProps = {
    title: string;
    onClick?: () => void;
    id?: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
};

const Btn = ({ title, onClick, id, type = 'button' }: BtnProps): JSX.Element => {
    return (
        <button type={type} className="regular-btn" id={id} onClick={onClick}>
            {title}
        </button>
    );
};

export default Btn;
