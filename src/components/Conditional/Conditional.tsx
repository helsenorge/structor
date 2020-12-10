import React, { useState } from 'react';
import { QuestionnaireItem } from '../../types/fhir';
import { IQuestionnaireItemType } from '../../types/IQuestionnareItemType';
import FormField from '../FormField/FormField';
import Select from '../Select/Select';
import './Conditional.css';

type Props = {
    item?: QuestionnaireItem;
};

const Conditional = ({ item }: Props): JSX.Element => {
    const [operator, setOperator] = useState<string>();
    const [condition, setCondition] = useState<string>();

    const options = [
        {
            code: 'exists',
            display: 'Eksisterer',
        },
        {
            code: '!=',
            display: 'Er lik',
        },
        {
            code: '>',
            display: 'Større enn',
        },
        {
            code: '<',
            display: 'Mindre enn',
        },
        {
            code: '>=',
            display: 'Større enn eller lik',
        },
        {
            code: '<=',
            display: 'Mindre enn eller lik',
        },
    ];

    return (
        <>
            {item?.type === IQuestionnaireItemType.integer && (
                <>
                    <div className="horizontal equal    ">
                        <FormField label="Vis hvis svaret er:">
                            <Select
                                options={options}
                                onChange={(e) => {
                                    setOperator(e.target.value);
                                }}
                            />
                        </FormField>
                        <FormField label="Tall">
                            <input onChange={(e) => setCondition(e.target.value)} />
                        </FormField>
                    </div>
                    <div className="infobox">
                        <p>Spørsmålet vil vises dersom svaret på:</p>
                        <p>
                            <strong>{item.text}</strong>{' '}
                            {options.find((x) => x.code === operator)?.display.toLocaleLowerCase()}{' '}
                            <strong>{condition}</strong>
                        </p>
                    </div>
                </>
            )}

            {item?.type !== IQuestionnaireItemType.integer && <p>TODO</p>}
        </>
    );
};

export default Conditional;
