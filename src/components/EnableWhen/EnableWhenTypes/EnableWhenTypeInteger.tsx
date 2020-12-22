import React from 'react';
import { operator } from '../../../helpers/QuestionHelper';
import { QuestionnaireItem, QuestionnaireItemEnableWhen } from '../../../types/fhir';
import { IEnableWhen } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import Infobox from '../Infobox';

type Props = {
    conditionItem: QuestionnaireItem;
    itemEnableWhen: QuestionnaireItemEnableWhen;
    dispatch: (value: IEnableWhen[]) => void;
};

const EnableWhenTypeInteger = ({ conditionItem, itemEnableWhen, dispatch }: Props): JSX.Element => {
    return (
        <>
            <div className="horizontal equal">
                <FormField label="Vis hvis svaret er:">
                    <Select
                        placeholder="Velg en operator"
                        options={operator}
                        value={itemEnableWhen?.operator}
                        onChange={(e) => {
                            const copy = { ...itemEnableWhen, operator: e.currentTarget.value };
                            dispatch([copy]);
                        }}
                    />
                </FormField>
                <FormField label="Tall">
                    <input
                        type="number"
                        defaultValue={itemEnableWhen?.answerInteger}
                        onChange={(e) => {
                            const copy = {
                                ...itemEnableWhen,
                                answerInteger: parseInt(e.currentTarget.value),
                            };
                            dispatch([copy]);
                        }}
                    />
                </FormField>
            </div>
            <Infobox title="Spørsmålet vil vises dersom svaret på:">
                <p>
                    <strong>{conditionItem.text}</strong>{' '}
                    {operator.find((x) => x.code === itemEnableWhen?.operator)?.display.toLocaleLowerCase()}{' '}
                    <strong>{itemEnableWhen?.answerInteger}</strong>
                </p>
            </Infobox>
        </>
    );
};

export default EnableWhenTypeInteger;
