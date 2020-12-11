import React from 'react';
import Select from '../../Select/Select';

const ValidationAnswerTypeNumber = (): JSX.Element => {
    return (
        <>
            <div className="validating-help-title">
                <p>Veiledende tekst</p>
            </div>

            <div className="allow-decimal">
                <input
                    type="checkbox"
                    onChange={() => {
                        // TODO
                    }}
                />
                <span> Tillat desimaltall</span>
            </div>

            <div className="form-field half">
                <label className="#">Svaret skal være:</label>
                <Select
                    options={[
                        { display: 'Velg kriterie', code: '0' },
                        { display: 'Større enn', code: '1' },
                        { display: 'Mindre enn', code: '2' },
                    ]}
                    onChange={() => {
                        //TODO!
                    }}
                ></Select>
            </div>

            {/* SHOW WHEN SELECED A VALUE */}
            <div className="form-field half">
                <label className="#">Skriv inn ett tall:</label>
                <input
                    type="input"
                    placeholder="5"
                    onChange={() => {
                        //TODO
                    }}
                ></input>
            </div>

            <div className="form-field">
                <a
                    href="#"
                    onClick={() => {
                        //TODO
                    }}
                >
                    + Legg til kriterie
                </a>
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

export default ValidationAnswerTypeNumber;
