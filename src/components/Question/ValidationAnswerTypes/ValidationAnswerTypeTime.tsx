import React from 'react';
import Picker from '../../DatePicker/DatePicker';
import Select from '../../Select/Select';

const ValidationAnswerTypeTime = () => {
    return (
        <>
            <div className="validating-help-title">
                <p>Veiledende tekst - Tid</p>
            </div>

            <div className="form-field half">
                <label className="#">Svaret skal være:</label>
                <Select
                    options={[
                        { display: 'Velg kriterie', code: '0' },
                        { display: '????', code: '1' },
                    ]}
                    onChange={() => {
                        //TODO!
                    }}
                ></Select>
            </div>

            <div className="form-field">
                <label></label>
                <Picker type="time" />
            </div>
        </>
    );
};

export default ValidationAnswerTypeTime;
