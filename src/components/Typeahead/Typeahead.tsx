import React, { ChangeEvent, useState } from 'react';
import { ValueSetComposeIncludeConcept } from '../../types/fhir';
import './Typeahead.css';

type Props = {
    items: ValueSetComposeIncludeConcept[];
    onChange: (value: string) => void;
    defaultValue?: string;
    placeholder?: string;
};

const Typeahead = ({ items, onChange, defaultValue, placeholder }: Props): JSX.Element => {
    const [value, setValue] = useState<string>(defaultValue || '');
    const [suggestions, setSuggestions] = useState<ValueSetComposeIncludeConcept[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target.value;
        setValue(target);
        if (target.length >= 2) {
            const matching = [...items]
                .sort()
                .filter((item) => item.display && item.display.toLowerCase().includes(target.toLowerCase()));
            setSuggestions(matching.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (selected: ValueSetComposeIncludeConcept) => {
        if (selected.display) {
            setValue(selected.display);
        }
        setSuggestions([]);
        onChange(selected.code);
    };

    const getHighlightedText = (text: string, highlight: string) => {
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part) => (part.toLowerCase() === highlight.toLowerCase() ? <strong>{part}</strong> : part))}
            </span>
        );
    };

    const renderSuggestions = () => {
        return (
            <ul>
                {suggestions?.map((suggestion, index) => (
                    <li
                        key={index}
                        aria-label={suggestion.display}
                        role="button"
                        tabIndex={0}
                        onKeyUp={(e) => e.key === 'Enter' && suggestion?.display && handleSelect(suggestion)}
                        onClick={() => suggestion.display && handleSelect(suggestion)}
                    >
                        {suggestion.display && <p>{getHighlightedText(suggestion.display, value)}</p>}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="typeahead">
            <div className="input-wrapper">
                <i className="search-icon" />
                <input onChange={handleChange} placeholder={placeholder || 'Søk..'} value={value} type="text" />
                {value.length > 0 && (
                    <i
                        className="close-icon"
                        role="button"
                        aria-label="Remove text"
                        onClick={() => {
                            setValue('');
                            setSuggestions([]);
                        }}
                    />
                )}
            </div>
            {suggestions.length > 0 && <div className="suggestions">{renderSuggestions()}</div>}
        </div>
    );
};

export default Typeahead;
