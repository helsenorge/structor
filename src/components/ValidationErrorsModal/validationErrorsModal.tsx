import React from 'react';
import { ValidationErrors } from '../../helpers/orphanValidation';
import Modal from '../Modal/Modal';

interface ValidationErrorsModalProps {
    validationErrors: ValidationErrors[];
    onClose: () => void;
}

export const ValidationErrorsModal = (props: ValidationErrorsModalProps): JSX.Element => {
    return (
        <Modal close={props.onClose} title="Validering" size="small" bottomCloseText="Lukk">
            {props.validationErrors.length > 0 ? (
                <div className="msg-error">
                    Fant <b>{props.validationErrors.length}</b> feil. Spørsmål med feil er markert med rød ramme.
                </div>
            ) : (
                <div>Fant ingen valideringsfeil!</div>
            )}
        </Modal>
    );
};
