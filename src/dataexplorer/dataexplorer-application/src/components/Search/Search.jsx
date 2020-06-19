import React, { useState, useEffect} from 'react';
import { Card } from 'antd';
import Search from 'antd/lib/input/Search';

const SearchBox = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    const cards = {
        items : [
            {
                id: 1,
                text: 'Marius heter jeg',
                yolo: 'yes'
            },
            {
                id: 2,
                text: 'Erling her',
                yolo: 'yes'
            },
            {
                id: 3,
                text: 'Jens',
                yolo: 'no'
            }
        ]
    }

    useEffect(() => {
        const results = cards.items.filter(card =>
            card.text.toLowerCase().includes(searchTerm)
            );
            setSearchResults(results);
    }, [searchTerm, cards.items])

    return(
        <>
            <div className='searchbox'>
                <Search onChange={handleChange}/>
            </div>
            <div>
                {searchResults.map(data => (
                    <Card key={searchResults.id}>
                        <h1>The ID for this Card is{data.id}</h1>
                        <p>Do you only live once? - {data.yolo}</p>
                        <p>{data.text}</p>
                    </Card>
                ))}
            </div>
        </>

    )
}
export default SearchBox;