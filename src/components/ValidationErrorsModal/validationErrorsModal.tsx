import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidationErrors } from '../../helpers/orphanValidation';
import Modal from '../Modal/Modal';

interface ValidationErrorsModalProps {
    validationErrors: ValidationErrors[];
    onClose: () => void;
}

export const ValidationErrorsModal = (props: ValidationErrorsModalProps): JSX.Element => {
    const { t } = useTranslation();
    return (
        <Modal close={props.onClose} title={t('Validering')} size="small" bottomCloseText={t('Lukk')}>
            {props.validationErrors.length > 0 ? (
                <div className="msg-error">
                    {t('Fant {0} feil. Spørsmål med feil er markert med rød ramme.').replace(
                        '{0}',
                        props.validationErrors.length.toString(),
                    )}
                </div>
            ) : (
                <div>{t('Fant ingen valideringsfeil!')}</div>
            )}
        </Modal>
    );
};
