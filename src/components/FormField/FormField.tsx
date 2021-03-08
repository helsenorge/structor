import React, { ReactNode } from 'react';

type Props = {
    label?: string;
    children?: ReactNode;
};

const FormField = ({ label, children }: Props): JSX.Element => {
    return (
        <div className="form-field">
            <label>{label}</label>
            {children}
        </div>
    );
};

export default FormField;
