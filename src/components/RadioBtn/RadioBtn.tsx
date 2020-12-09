import React from 'react';

type Props = {
    valueSetID: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deletable: boolean;
};

//TODO: legg til slik at man kan slette

const RadioBtn = ({ valueSetID, value, onChange }: Props): JSX.Element => {
    return (
        <div className="horizontal">
            <input type="radio" name={valueSetID} />{' '}
            <input type="text" name="beskrivelse" onChange={onChange} value={value} />
        </div>
    );
};

export default RadioBtn;
