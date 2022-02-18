import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidationErrors } from '../../helpers/orphanValidation';
import Modal from '../Modal/Modal';

interface ValidationErrorsModalProps {
    validationErrors: ValidationErrors[];
    translationErrors: ValidationErrors[];
    hasTranslations: boolean;
    onClose: () => void;
}

export const ValidationErrorsModal = (props: ValidationErrorsModalProps): JSX.Element => {
    const { t } = useTranslation();
    return (
        <Modal close={props.onClose} title={t('Validation')} bottomCloseText={t('Close')}>
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
            {props.translationErrors.length > 0 ? (
                <div className="msg-error" style={{ paddingTop: '10px' }}>
                    {t('Found {0} missing translations.').replace('{0}', props.translationErrors.length.toString())}
                </div>
            ) : (
                <>
                    {props.hasTranslations && (
                        <div style={{ paddingTop: '10px' }}>{t('Found no translations errors!')}</div>
                    )}
                </>
            )}
        </Modal>
    );
};
