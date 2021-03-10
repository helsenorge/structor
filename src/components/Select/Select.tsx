import React from 'react';
import './Select.css';
import downArrow from '../../images/icons/chevron-down-outline.svg';
import { ValueSetComposeIncludeConcept } from '../../types/fhir';

type Props = {
    options: ValueSetComposeIncludeConcept[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    placeholder?: string;
    compact?: boolean;
};

const Select = ({ options, onChange, value, placeholder, compact }: Props): JSX.Element => {
    return (
        <div className={`selector ${compact ? 'compact' : ''}`}>
            <select onChange={onChange} value={value || ''}>
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((item, index) => (
                    <option key={index} value={item.code}>
                        {item.display}
                    </option>
                ))}
            </select>
            <img src={downArrow} height="25" />
        </div>
    );
};

export default Select;
