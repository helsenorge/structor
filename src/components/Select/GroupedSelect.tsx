import React from 'react';
import { isOptionGroup, Option, OptionGroup, Options } from '../../types/OptionTypes';
import './Select.css';

type GroupedSelectProps = {
    options: Options;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    placeholder?: string;
    compact?: boolean;
    displaySelectedValue?: boolean;
};

const GroupedSelect = ({
    options,
    onChange,
    value,
    placeholder,
    compact,
    displaySelectedValue,
}: GroupedSelectProps): JSX.Element => {
    return (
        <div className={`selector ${compact ? 'compact' : ''}`}>
            <select onChange={onChange} value={value || ''}>
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.options.map((optionElement, groupIndex) => {
                    if (isOptionGroup(optionElement)) {
                        const group = optionElement as OptionGroup;
                        return (
                            <optgroup label={optionElement.display} key={groupIndex}>
                                {group.options.map((opt, optionIndex) => (
                                    <option key={`${groupIndex}-${optionIndex}`} value={opt.code}>
                                        {opt.display}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    }
                    const option = optionElement as Option;
                    if (option) {
                        return (
                            <option key={groupIndex} value={option.code}>
                                {option.display}
                            </option>
                        );
                    }
                })}
            </select>
            <span className="down-arrow-icon" />
            {displaySelectedValue && <div className="select-display-value">{value}</div>}
        </div>
    );
};

export default GroupedSelect;
