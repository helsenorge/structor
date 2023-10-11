import React from 'react';
import { useTranslation } from 'react-i18next';
import { isOptionGroup, Option, OptionGroup } from '../../types/OptionTypes';
import './Select.css';

type GroupedSelectProps = {
    options: Array<Option | OptionGroup>;
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
    const { t } = useTranslation();
    return (
        <div className={`selector ${compact ? 'compact' : ''}`}>
            <select onChange={onChange} value={value || ''}>
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((optionElement, groupIndex) => {
                    if (isOptionGroup(optionElement)) {
                        const group = optionElement as OptionGroup;
                        return (
                            <optgroup label={t(optionElement.display)} key={groupIndex}>
                                {group.options.map((opt, optionIndex) => (
                                    <option key={`${groupIndex}-${optionIndex}`} value={opt.code}>
                                        {t(opt.display)}
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
