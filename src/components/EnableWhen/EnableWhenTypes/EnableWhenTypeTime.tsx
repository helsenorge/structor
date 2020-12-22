import { format, parse } from 'date-fns';
import React from 'react';
import { operator } from '../../../helpers/QuestionHelper';
import { QuestionnaireItem, QuestionnaireItemEnableWhen } from '../../../types/fhir';
import { IEnableWhen } from '../../../types/IQuestionnareItemType';
import Picker from '../../DatePicker/DatePicker';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';
import Infobox from '../Infobox';

type Props = {
    conditionItem: QuestionnaireItem;
    itemEnableWhen: QuestionnaireItemEnableWhen;
    dispatch: (value: IEnableWhen[]) => void;
};

const EnableWhenTypeTime = ({ conditionItem, itemEnableWhen, dispatch }: Props): JSX.Element => {
    const selectedTime = itemEnableWhen.answerTime
        ? parse(itemEnableWhen.answerTime, 'HH:mm:ss', new Date())
        : undefined;

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
                <Picker
                    selected={selectedTime}
                    type="time"
                    disabled={false}
                    withPortal
                    callback={(date: Date) => {
                        const copy = {
                            ...itemEnableWhen,
                            answerTime: format(date, 'HH:mm:ss'),
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

export default EnableWhenTypeTime;
