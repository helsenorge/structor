import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    return (
        <div className="overlay align-everything">
            <div className={`modal ${size}`} id={id}>
                <div className="title">
                    <IconBtn type="x" title={t('Close')} onClick={close} />
                    <h1>{title}</h1>
                </div>
                <div className="content">{children}</div>
                {bottomCloseText && (
                    <div className="modal-btn-bottom">
                        <div className="center-text">
                            <Btn title={bottomCloseText} type="button" variant="secondary" onClick={close} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
