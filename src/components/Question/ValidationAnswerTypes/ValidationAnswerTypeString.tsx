import React from 'react';
import Select from '../../Select/Select';

const ValidationAnswerTypeString = (): JSX.Element => {
    return (
        <>
            <div className="validating-help-title">
                <p>Veiledende tekst - kortsvar</p>
            </div>

            <div className="form-field half">
                <label className="#">Svaret skal være:</label>
                <Select
                    options={[
                        { display: 'Velg kriterie', code: '0' },
                        { display: 'Epost', code: '1' },
                        { display: 'URL', code: '2' },
                        { display: 'Fødselsnummer', code: '3' },
                        { display: 'Postnummer', code: '4' },
                    ]}
                    onChange={() => {
                        //TODO!
                    }}
                ></Select>
            </div>

            <div className="form-field custom-input-error-message">
                <label className="#">Legg til egendefinert feilmelding:</label>
                <input
                    type="input"
                    placeholder="feilmelding"
                    onChange={() => {
                        //TODO
                    }}
                ></input>
            </div>
        </>
    );
};

export default ValidationAnswerTypeString;
