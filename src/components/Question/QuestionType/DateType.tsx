import React from 'react';
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
            <FormField label="Datotype">
                <label>
                    <input
                        type="radio"
                        checked={!getItemControlCode()}
                        name="date-type-radio"
                        onChange={() => {
                            removeItemExtension(item, IExtentionType.itemControl, dispatch);
                        }}
                    />
                    <span> Dag, måned og år</span>
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
                    <span> Måned og år</span>
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
                    <span> År</span>
                </label>
            </FormField>
            <Picker />
        </>
    );
};
