import React from 'react';
import { useTranslation } from 'react-i18next';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import { ItemControlType } from '../../../helpers/itemControl';
import { ActionType } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../../types/fhir';
import { IExtentionType, IValueSetSystem } from '../../../types/IQuestionnareItemType';
import Picker from '../../DatePicker/DatePicker';
import FormField from '../../FormField/FormField';

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
        const newExtension = {
            url: IExtentionType.itemControl,
            valueCodeableConcept: {
                coding: [
                    {
                        system: IValueSetSystem.itemControlValueSet,
                        code: code,
                    },
                ],
            },
        };
        setItemExtension(item, newExtension, dispatch);
    };

    return (
        <>
            <FormField label={t('Datotype')}>
                <label>
                    <input
                        type="radio"
                        checked={!getItemControlCode()}
                        name="date-type-radio"
                        onChange={() => {
                            removeItemExtension(item, IExtentionType.itemControl, dispatch);
                        }}
                    />
                    <span>{` ${t('Dag, måned og år')}`}</span>
                </label>
                <label>
                    <input
                        type="radio"
                        checked={getItemControlCode() === ItemControlType.yearMonth}
                        name="date-type-radio"
                        onChange={() => {
                            setItemControlExtension(ItemControlType.yearMonth);
                        }}
                    />
                    <span>{` ${t('Måned og år')}`}</span>
                </label>
                <label>
                    <input
                        type="radio"
                        checked={getItemControlCode() === ItemControlType.year}
                        name="date-type-radio"
                        onChange={() => {
                            setItemControlExtension(ItemControlType.year);
                        }}
                    />
                    <span>{` ${t('År')}`}</span>
                </label>
            </FormField>
            <Picker />
        </>
    );
};
