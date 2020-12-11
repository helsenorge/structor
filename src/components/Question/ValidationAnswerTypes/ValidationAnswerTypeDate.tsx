import Select from '../../Select/Select';
import React from 'react';

const ValidationAnswerTypeDate = (): JSX.Element => {
    return (
        <>
            <div className="validating-help-title">
                <p>Veiledende tekst - Dato</p>
            </div>

            <div className="form-field half">
                <label className="#">Svaret skal være:</label>
                <Select
                    options={[
                        { display: 'Velg kriterie', code: '0' },
                        { display: 'Mellom to datoer', code: '1' },
                        { display: 'Før en bestemt tid', code: '2' },
                        { display: 'Ette en bestemt tid', code: '3' },
                        { display: 'Antall dager før', code: '4' },
                        { display: 'Antall dager etter', code: '5' },
                    ]}
                    onChange={() => {
                        //TODO!
                    }}
                ></Select>
            </div>
        </>
    );
};

export default ValidationAnswerTypeDate;
