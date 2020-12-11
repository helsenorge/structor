import React from 'react';
import CloseIcon from '../../images/icons/close-outline.svg';
import './RadioBtn.css';

type Props = {
    valueSetID?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteItem?: () => void;
    showDelete?: boolean;
    disabled?: boolean;
};

const RadioBtn = ({ valueSetID, value, onChange, deleteItem, showDelete, disabled }: Props): JSX.Element => {
    return (
        <div className="horizontal">
            <input disabled={disabled} type="radio" name={valueSetID} />{' '}
            <input disabled={disabled} type="text" name="beskrivelse" onChange={onChange} value={value} />
            {showDelete && (
                <button type="button" name="Fjern" onClick={deleteItem}>
                    <img src={CloseIcon} height="25" width="25"></img>
                </button>
            )}
        </div>
    );
};

export default RadioBtn;
