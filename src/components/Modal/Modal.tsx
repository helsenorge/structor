import React from 'react';
import IconBtn from '../IconBtn/IconBtn';

type Props = {
    close: () => void;
    title?: string;
    children: JSX.Element | JSX.Element[];
    size?: 'large' | 'small';
};

const Modal = ({ close, children, title, size = 'small' }: Props): JSX.Element => {
    return (
        <div className="overlay">
            <div className={`modal ${size}`}>
                <div className="title">
                    <IconBtn type="x" title="Lukk" onClick={close} />
                    <h1>{title}</h1>
                </div>
                <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
