import React, { ChangeEvent, useState } from 'react';

type Props = {
    items: string[];
};

const Typeahead = ({ items }: Props): JSX.Element => {
    const [value, setValue] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>(items);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, `i`);
            console.log(
                suggestions.sort().filter((v) => regex.test(v)),
                'matching',
            );
        }
    };

    return (
        <div className="Typeahead">
            <input onChange={handleChange} placeholder="Search for whatever.." value={value} type="text" />
        </div>
    );
};

export default Typeahead;
