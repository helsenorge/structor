import React, { ChangeEvent, useState } from 'react';
import './Typeahead.css';

type Props = {
    items: string[];
};

const Typeahead = ({ items }: Props): JSX.Element => {
    const [value, setValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        if (value.length >= 2) {
            const matching = items.sort().filter((item) => item.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(matching.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (selected: string) => {
        setValue(selected);
        setSuggestions([]);
    };

    const getHighlightedText = (text: string, highlight: string) => {
        // Split text on highlight term, include term itself into parts, ignore case
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>{parts.map((part) => (part.toLowerCase() === highlight.toLowerCase() ? <b>{part}</b> : part))}</span>
        );
    };

    const renderSuggestions = () => {
        return (
            <ul>
                {suggestions?.map((suggestion, index) => (
                    <li
                        key={index}
                        aria-label={suggestion}
                        role="button"
                        tabIndex={0}
                        onKeyUp={(e) => e.key === 'Enter' && handleSelect(suggestion)}
                        onClick={() => handleSelect(suggestion)}
                    >
                        <p>{getHighlightedText(suggestion, value)}</p>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="typeahead">
            <div className="input-wrapper">
                <i className="search-icon" />
                <input onChange={handleChange} placeholder="Søk etter lykken.." value={value} type="text" />
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
