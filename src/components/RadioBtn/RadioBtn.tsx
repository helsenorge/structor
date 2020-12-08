import React from 'react';

type Props = {
    valueSetID: string;
    value?: string;
};

const RadioBtn = ({ valueSetID, value }: Props): JSX.Element => {
    return (
        <div className="horizontal">
            <input type="radio" name={valueSetID} /> <input type="text" name="beskrivelse" value={value} />
        </div>
    );
};

export default RadioBtn;
