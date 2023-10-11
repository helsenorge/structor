import React from 'react';
import { useTranslation } from 'react-i18next';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import { createItemControlExtension, ItemControlType } from '../../../helpers/itemControl';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { ActionType } from '../../../store/treeStore/treeStore';
import { QuestionnaireItem } from '../../../types/fhir';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import RadioBtn from '../../RadioBtn/RadioBtn';

type Props = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

const DAYTIME_CHOICE = 'dayTime';

export const DateType = ({ item, dispatch }: Props): JSX.Element => {
    const { t } = useTranslation();
    const getItemControlCode = (): string => {
        if (item.type === IQuestionnaireItemType.dateTime) {
            return DAYTIME_CHOICE;
        } else {
            const itemControl = item?.extension?.find((x) => x.url === IExtentionType.itemControl);
            return itemControl?.valueCodeableConcept?.coding?.find((x) => !!x.code)?.code || '';
        }
    };

    const setItemControlExtension = (code: string) => {
        const newExtension = createItemControlExtension(code as ItemControlType);
        setItemExtension(item, newExtension, dispatch);
    };

    return (
        <FormField label={t('Date type')}>
            <RadioBtn
                onChange={(newValue) => {
                    if (newValue === DAYTIME_CHOICE) {
                        removeItemExtension(item, IExtentionType.itemControl, dispatch);
                        dispatch(updateItemAction(item.linkId, IItemProperty.type, IQuestionnaireItemType.dateTime));
                    } else {
                        dispatch(updateItemAction(item.linkId, IItemProperty.type, IQuestionnaireItemType.date));
                        if (newValue) {
                            setItemControlExtension(newValue);
                        } else {
                            removeItemExtension(item, IExtentionType.itemControl, dispatch);
                        }
                    }
                }}
                checked={getItemControlCode()}
                options={[
                    { code: DAYTIME_CHOICE, display: t('Time, day, month and year') },
                    { code: '', display: t('Day, month and year') },
                    { code: ItemControlType.yearMonth, display: t('Month and year') },
                    { code: ItemControlType.year, display: t('Year') },
                ]}
                name="date-type-radio"
            />
        </FormField>
    );
};
