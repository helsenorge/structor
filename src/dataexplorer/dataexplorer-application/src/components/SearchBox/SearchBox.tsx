import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import Search from 'antd/lib/input/Search';
import { IPatient } from 'types/IPatient';

const cards: IPatient[] = [
    {
        id: 1,
        name: 'Erling',
        description: ['tall', 'male', 'sick'],
        age: 98,
        isHuman: true,
    },
    {
        id: 2,
        name: 'Frøydis',
        description: ['short', 'male', 'healthy'],
        age: 27,
        isHuman: false,
    },
    {
        id: 3,
        name: 'Marius',
        description: ['short', 'male', ''],
        age: 14,
        isHuman: true,
    },
    {
        id: 4,
        name: 'Rebekka',
        description: ['tall', 'female', 'sick'],
        age: 16,
        isHuman: true,
    },
    {
        id: 5,
        name: 'Jenny',
        description: ['tall', 'female', 'sick'],
        age: 42,
        isHuman: false,
    },
    {
        id: 6,
        name: 'Jens',
        description: ['tall', 'female', 'sick'],
        age: 7,
        isHuman: true,
    },
];

const SearchBox = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<IPatient[]>([]);

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const results: IPatient[] = cards.filter((card) =>
            card.name.toLowerCase().includes(searchTerm),
        );
        setSearchResults(results);
    }, [searchTerm]);

    return (
        <>
            <div className="searchbox">
                <Search onChange={handleChange} />
            </div>
            <div>
                {searchResults.map((data) => (
                    <Card key={data.id} hoverable>
                        <h1>{data.name}</h1>
                        <p>Patient ID: {data.id} </p>
                        <p>Age: {data.age} years old.</p>
                        <p>
                            Description:{' '}
                            {data.description[0] +
                                ' ' +
                                data.description[1] +
                                ' ' +
                                data.description[2]}
                        </p>
                    </Card>
                ))}
            </div>
        </>
    );
};
export default SearchBox;
