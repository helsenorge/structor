import React from 'react';
import CloseIcon from '../../images/icons/close-outline.svg';
import './RadioBtn.css';

type Props = {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteItem?: () => void;
    showDelete?: boolean;
    disabled?: boolean;
    name?: string;
};

const RadioBtn = ({ value, onChange, deleteItem, showDelete, disabled, name }: Props): JSX.Element => {
    return (
        <div className="horizontal radioBtn">
            <input disabled={disabled} name={name} type="radio" />{' '}
            <input
                autoComplete="off"
                disabled={disabled}
                type="text"
                name="beskrivelse"
                onChange={onChange}
                value={value}
            />
            {showDelete && (
                <button type="button" name="Fjern" onClick={deleteItem}>
                    <img src={CloseIcon} height="25" width="25"></img>
                </button>
            )}
        </div>
    );
};

export default RadioBtn;
