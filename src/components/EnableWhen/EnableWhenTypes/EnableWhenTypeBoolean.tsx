import React from 'react';
import { QuestionnaireItem, QuestionnaireItemEnableWhen, ValueSetComposeIncludeConcept } from '../../../types/fhir';
import { IEnableWhen, IOperator } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import Infobox from '../Infobox';

type Props = {
    conditionItem: QuestionnaireItem;
    itemEnableWhen: QuestionnaireItemEnableWhen;
    dispatch: (value: IEnableWhen[]) => void;
};

const EnableWhenTypeBoolean = ({ conditionItem, itemEnableWhen, dispatch }: Props): JSX.Element => {
    const booleanChoices: ValueSetComposeIncludeConcept[] = [
        { display: 'Avhuket', code: 'true' },
        { display: 'Ikke avhuket', code: 'false' },
    ];

    const getAnswer = () => {
        if (itemEnableWhen.answerBoolean === true) {
            return 'true';
        }
        if (itemEnableWhen.answerBoolean === false) {
            return 'false';
        }

        return '';
    };

    return (
        <>
            <FormField label="Hvis hvis svaret er:">
                <Select
                    placeholder="Velg et alternativ.."
                    options={booleanChoices}
                    value={getAnswer()}
                    onChange={(e) => {
                        const copy = {
                            ...itemEnableWhen,
                            operator: IOperator.equal,
                            answerBoolean: e.target.value === 'true',
                        };
                        dispatch([copy]);
                    }}
                />
            </FormField>
            <Infobox title="Spørsmålet vil vises dersom svaret på:">
                <p>
                    <strong>{conditionItem.text}</strong> er{' '}
                    <strong>
                        {itemEnableWhen.answerBoolean === true && 'avhuket'}
                        {itemEnableWhen.answerBoolean === false && 'ikke avhuket'}
                    </strong>
                </p>
            </Infobox>
        </>
    );
};

export default EnableWhenTypeBoolean;
