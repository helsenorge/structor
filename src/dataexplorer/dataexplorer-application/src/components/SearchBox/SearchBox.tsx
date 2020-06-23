import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import Search from 'antd/lib/input/Search';
import { IPatient } from 'types/IPatient';

const SearchBox = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<IPatient[]>([]);

    const handleChange = (event: any) => {
        setSearchTerm(event.target.value);
    };
    const cards: IPatient[] = [
        {
            id: '1',
            birthDate: '2015-01-02',
            gender: 'male',
            name: [
                {
                    family: 'Er',
                    given: ['Erling'],
                },
            ],
        },
        {
            id: '2',
            birthDate: '2016-01-02',
            gender: 'male',
            name: [
                {
                    family: 'Ma',
                    given: ['Marius'],
                },
            ],
        },
        {
            id: '3',
            birthDate: '2017-01-02',
            gender: 'female',
            name: [
                {
                    family: 'Fr',
                    given: ['Frøydis'],
                },
            ],
        },
        {
            id: '4',
            birthDate: '2018-01-02',
            gender: 'female',
            name: [
                {
                    family: 'Re',
                    given: ['Rebekka'],
                },
            ],
        },
        {
            id: '5',
            birthDate: '2019-01-02',
            gender: 'robot',
            name: [
                {
                    family: 'Pan',
                    given: ['Pieter'],
                },
            ],
        },
        {
            id: '6',
            birthDate: '2020-01-02',
            gender: 'apache helicopter',
            name: [
                {
                    family: 'van de Heuvel',
                    given: ['Pieter'],
                },
            ],
        },
    ];

    useEffect(() => {
        const results: IPatient[] = cards.filter((card) =>
            card.name[0].given[0].includes(searchTerm),
        );
        setSearchResults(results);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    </Card>
                ))}
            </div>
        </>
    );
};
export default SearchBox;
