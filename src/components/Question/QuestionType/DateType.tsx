import React from 'react';
import { useTranslation } from 'react-i18next';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import { createItemControlExtension, ItemControlType } from '../../../helpers/itemControl';
import { ActionType } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../../types/fhir';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import RadioBtn from '../../RadioBtn/RadioBtn';

type Props = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const DateType = ({ item, dispatch }: Props): JSX.Element => {
    const { t } = useTranslation();
    const getItemControlCode = (): string => {
        const itemControl = item?.extension?.find((x) => x.url === IExtentionType.itemControl);
        return itemControl?.valueCodeableConcept?.coding?.find((x) => !!x.code)?.code || '';
    };

    const setItemControlExtension = (code: string) => {
        const newExtension = createItemControlExtension(code as ItemControlType);
        setItemExtension(item, newExtension, dispatch);
    };

    return (
        <FormField label={t('Date type')}>
            <RadioBtn
                onChange={(newValue) => {
                    if (newValue) {
                        setItemControlExtension(newValue);
                    } else {
                        removeItemExtension(item, IExtentionType.itemControl, dispatch);
                    }
                }}
                checked={getItemControlCode()}
                options={[
                    { code: '', display: t('Day, month and year') },
                    { code: ItemControlType.yearMonth, display: t('Month and year') },
                    { code: ItemControlType.year, display: t('Year') },
                ]}
                name="date-type-radio"
            />
        </FormField>
    );
};
