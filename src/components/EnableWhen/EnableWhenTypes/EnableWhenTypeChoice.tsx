import React from 'react';
import { getSystem } from '../../../helpers/answerOptionHelper';
import { QuestionnaireItem, QuestionnaireItemEnableWhen, ValueSetComposeIncludeConcept } from '../../../types/fhir';
import { IEnableWhen, IOperator } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import Infobox from '../Infobox';

type Props = {
    choices: ValueSetComposeIncludeConcept[];
    conditionItem: QuestionnaireItem;
    itemEnableWhen: QuestionnaireItemEnableWhen;
    dispatch: (value: IEnableWhen[]) => void;
};

const EnableWhenTypeChoice = ({ choices, conditionItem, itemEnableWhen, dispatch }: Props): JSX.Element => {
    return (
        <>
            <FormField label="Hvis hvis svaret er:">
                <Select
                    placeholder="Velg et alternativ.."
                    options={choices}
                    value={itemEnableWhen?.answerCoding?.code}
                    onChange={(e) => {
                        const copy = {
                            ...itemEnableWhen,
                            operator: IOperator.equal,
                            answerCoding: {
                                system: getSystem(conditionItem.linkId),
                                code: e.target.value,
                            },
                        };
                        dispatch([copy]);
                    }}
                />
            </FormField>
            <Infobox title="Spørsmålet vil vises dersom svaret på:">
                <p>
                    <strong>{conditionItem.text}</strong> er lik{' '}
                    <strong>{choices.find((x) => x.code === itemEnableWhen?.answerCoding?.code)?.display}</strong>
                </p>
            </Infobox>
        </>
    );
};

export default EnableWhenTypeChoice;
