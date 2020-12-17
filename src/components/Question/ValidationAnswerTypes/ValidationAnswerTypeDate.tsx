import React from 'react';
import { QuestionnaireItem } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import Picker from '../../DatePicker/DatePicker';

type Props = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeDate = ({ item }: Props): JSX.Element => {
    return (
        <>
            <div className="horizontal">
                <FormField label="Min dato:">
                    <Picker
                        type="date"
                        disabled={false}
                        withPortal
                        callback={(date) => {
                            console.log(date);
                        }}
                    />
                </FormField>
                <FormField label="Max dato:">
                    <Picker
                        type="date"
                        disabled={false}
                        withPortal
                        callback={(date) => {
                            console.log(date);
                        }}
                    />
                </FormField>
            </div>
        </>
    );
};

export default ValidationAnswerTypeDate;
