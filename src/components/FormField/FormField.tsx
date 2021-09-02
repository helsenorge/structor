import React, { ReactNode } from 'react';

type Props = {
    label?: string;
    sublabel?: string;
    children?: ReactNode;
};

const FormField = ({ label, sublabel, children }: Props): JSX.Element => {
    return (
        <div className="form-field">
            {label && <label>{label}</label>}
            {sublabel && <div>{sublabel}</div>}
            {children}
        </div>
    );
};

export default FormField;
