import React from 'react';
import './Btn.css';

type BtnProps = {
    title: string;
    onClick: () => void;
    id?: string;
};

const Btn = ({ title, onClick, id }: BtnProps): JSX.Element => {
    return (
        <button className="regular-btn" id={id} onClick={onClick}>
            {title}
        </button>
    );
};

export default Btn;
