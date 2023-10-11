import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    label?: string;
    sublabel?: string;
    isOptional?: boolean;
    children?: ReactNode;
};

const FormField = ({ label, sublabel, isOptional, children }: Props): JSX.Element => {
    const { t } = useTranslation();

    return (
        <div className="form-field">
            {label && (
                <label>
                    <span>{label}</span>
                    {isOptional && <span className="form-field__optional">{` (${t('Optional')})`}</span>}
                </label>
            )}
            {sublabel && <div className="form-field__sublabel">{sublabel}</div>}
            {children}
        </div>
    );
};

export default FormField;
