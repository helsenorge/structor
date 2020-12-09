import React from 'react';

type Props = {
    valueSetID?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteItem?: () => void;
    counter: number;
};

const RadioBtn = ({ valueSetID, value, onChange, deleteItem, counter }: Props): JSX.Element => {
    return (
        <div className="horizontal">
            <input type="radio" name={valueSetID} />{' '}
            <input type="text" name="beskrivelse" onChange={onChange} value={value} />
            {counter > 1 && (
                <button type="button" name="Fjern" onClick={deleteItem}>
                    X
                </button>
            )}
        </div>
    );
};

export default RadioBtn;
