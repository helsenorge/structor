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
        <Modal close={props.onClose} title={t('Validation')} size="small" bottomCloseText={t('Close')}>
            {props.validationErrors.length > 0 ? (
                <div className="msg-error">
                    {t('Found {0} errors. Questions with errors are marked with a red border.').replace(
                        '{0}',
                        props.validationErrors.length.toString(),
                    )}
                </div>
            ) : (
                <div>{t('Found no validation errors!')}</div>
            )}
        </Modal>
    );
};
