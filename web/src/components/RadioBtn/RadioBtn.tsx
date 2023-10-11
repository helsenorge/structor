import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValueSetComposeIncludeConcept } from '../../types/fhir';
import './RadioBtn.css';

type Props = {
    onChange: (value: string) => void;
    checked?: string;
    options: ValueSetComposeIncludeConcept[];
    name: string;
};

const RadioBtn = ({ checked, onChange, options, name }: Props): JSX.Element => {
    const { t } = useTranslation();

    return (
        <div className="radioBtn">
            {options.map((x) => {
                return (
                    <div key={x.code}>
                        <label>
                            <input
                                className="radioBtn-input"
                                type="radio"
                                checked={x.code === checked}
                                value={x.code}
                                name={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    onChange(e.target.value);
                                }}
                            />
                            <span>{` ${t(x.display || '')}`}</span>
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

export default RadioBtn;
