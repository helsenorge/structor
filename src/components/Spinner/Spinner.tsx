import React from 'react';
import './Spinner.css';

type Props = {
    state: 'loading' | 'success' | 'error' | '';
};

const Spinner = ({ state }: Props): JSX.Element => {
    return (
        <div className={`loader ${state}`}>
            <svg className="spinner" width="43px" height="43px" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                <circle
                    className="path"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    cx="22"
                    cy="22"
                    r="20"
                ></circle>
            </svg>
        </div>
    );
};

export default Spinner;
