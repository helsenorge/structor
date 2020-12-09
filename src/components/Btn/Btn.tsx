import React from 'react';
import './Btn.css';

type BtnProps = {
    title: string;
    onClick: () => void;
};

const Btn = ({ title, onClick }: BtnProps): JSX.Element => {
    return (
        <button className="regular-btn" onClick={onClick}>
            {title}
        </button>
    );
};

export default Btn;
