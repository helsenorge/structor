import React, { ReactNode } from 'react';
import Btn from '../Btn/Btn';
import './Confirm.css';

type ConfirmProps = {
    onConfirm: () => void;
    onDeny: () => void;
    id?: string;
    title?: string;
    children?: ReactNode;
};

const Confirm = ({ onConfirm, onDeny, children, id, title }: ConfirmProps): JSX.Element => {
    return (
        <div className="overlay">
            <div className="modal small" id={id}>
                <div className="title">
                    <h1>{title}</h1>
                </div>
                <div className="content">{children}</div>
                <div className="modal-btn-bottom">
                    <div className="center-text">
                        <Btn title="Ja" type="button" variant="primary" size="small" onClick={onConfirm} />{' '}
                        <Btn title="Nei" type="button" variant="secondary" size="small" onClick={onDeny} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirm;
