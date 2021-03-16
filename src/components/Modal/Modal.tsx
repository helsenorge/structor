import React from 'react';
import Btn from '../Btn/Btn';
import IconBtn from '../IconBtn/IconBtn';
import './Modal.css';

type Props = {
    close?: () => void;
    title?: string;
    children: JSX.Element | JSX.Element[];
    size?: 'large' | 'small';
    id?: string;
    bottomCloseText?: string;
};

const Modal = ({ close, children, title, size = 'small', id, bottomCloseText }: Props): JSX.Element => {
    return (
        <div className="overlay">
            <div className={`modal ${size}`} id={id}>
                <div className="title">
                    <IconBtn type="x" title="Lukk" onClick={close} />
                    <h1>{title}</h1>
                </div>
                <div className="content">{children}</div>
                {bottomCloseText && (
                    <div className="modal-btn-bottom">
                        <div className="center-text">
                            <Btn
                                title={bottomCloseText}
                                size="small"
                                type="button"
                                variant="secondary"
                                onClick={close}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
