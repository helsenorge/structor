import { formatISO, parseISO } from 'date-fns';
import React from 'react';
import { operator } from '../../../helpers/QuestionHelper';
import { QuestionnaireItem, QuestionnaireItemEnableWhen } from '../../../types/fhir';
import { IEnableWhen } from '../../../types/IQuestionnareItemType';
import DateTimePicker from '../../DatePicker/DateTimePicker';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import Infobox from '../Infobox';

type Props = {
    conditionItem: QuestionnaireItem;
    itemEnableWhen: QuestionnaireItemEnableWhen;
    dispatch: (value: IEnableWhen[]) => void;
};

const EnableWhenTypeDateTime = ({ conditionItem, itemEnableWhen, dispatch }: Props): JSX.Element => {
    const selectedDateTime = itemEnableWhen.answerDateTime ? parseISO(itemEnableWhen?.answerDateTime) : undefined;

    return (
        <>
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
                <DateTimePicker
                    selected={selectedDateTime}
                    disabled={false}
                    withPortal
                    callback={(date: Date) => {
                        const copy = {
                            ...itemEnableWhen,
                            answerDateTime: formatISO(date),
                        };
                        dispatch([copy]);
                    }}
                />
            </FormField>
            <Infobox title="Spørsmålet vil vises dersom svaret på:">
                <p>
                    <strong>{conditionItem.text}</strong>{' '}
                    {operator.find((x) => x.code === itemEnableWhen?.operator)?.display.toLocaleLowerCase()}{' '}
                    <strong>{itemEnableWhen.answerTime?.slice(0, 5)}</strong>
                </p>
            </Infobox>
        </>
    );
};

export default EnableWhenTypeDateTime;
